import mongoose from "mongoose";
import Bug from "../models/Bug.js";
import Project from "../models/Project.js";
import Comment from "../models/Comment.js";
import users from "../data/users.js";

const STATUSES = Bug.schema.path("status").enumValues;

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const handleError = (res, error) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }
  res.status(500).json({ message: error.message });
};

export const getBugs = async (req, res) => {
  try {
    const { project, status, severity, assignee, q, page, limit } = req.query;
    const filter = {};

    if (project) {
      if (!mongoose.isValidObjectId(project)) {
        return res.status(400).json({ message: "Invalid project id" });
      }
      filter.project = project;
    }
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (assignee) filter.assignee = assignee === "unassigned" ? null : assignee;
    if (q) filter.title = { $regex: escapeRegex(String(q)), $options: "i" };

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

    const [bugs, total] = await Promise.all([
      Bug.find(filter)
        .populate("project", "name")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Bug.countDocuments(filter),
    ]);

    res.json({
      bugs,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getBugById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid bug id" });
    }

    const bug = await Bug.findById(req.params.id).populate("project", "name");
    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }
    res.json(bug);
  } catch (error) {
    handleError(res, error);
  }
};

export const createBug = async (req, res) => {
  try {
    const { title, description, severity, priority, project } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: "Title and project are required" });
    }
    if (!mongoose.isValidObjectId(project)) {
      return res.status(400).json({ message: "Invalid project id" });
    }
    if (!(await Project.exists({ _id: project }))) {
      return res.status(404).json({ message: "Project not found" });
    }

    const bug = await Bug.create({
      title,
      description,
      severity,
      priority,
      project,
      reporter: req.user.id,
    });
    res.status(201).json(bug);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateBug = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid bug id" });
    }

    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isReporter = bug.reporter === req.user.id;
    if (!isAdmin && !isReporter) {
      return res.status(403).json({ message: "You are not allowed to edit this bug" });
    }

    const { title, description, severity, priority } = req.body;
    if (title !== undefined) bug.title = title;
    if (description !== undefined) bug.description = description;
    if (severity !== undefined) bug.severity = severity;
    if (priority !== undefined) bug.priority = priority;

    await bug.save();
    res.json(bug);
  } catch (error) {
    handleError(res, error);
  }
};

export const assignBug = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid bug id" });
    }

    const { assignee } = req.body;
    if (assignee === undefined) {
      return res.status(400).json({ message: "assignee is required (use null to unassign)" });
    }

    if (assignee !== null) {
      const developer = users.find((u) => u.id === assignee && u.role === "developer");
      if (!developer) {
        return res.status(400).json({ message: "Assignee must be a developer" });
      }
    }

    const bug = await Bug.findByIdAndUpdate(
      req.params.id,
      { assignee },
      { new: true }
    );
    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }
    res.json(bug);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateBugStatus = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid bug id" });
    }

    const { status } = req.body;
    if (!STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${STATUSES.join(", ")}`,
      });
    }

    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isAssignee = bug.assignee === req.user.id;
    if (!isAdmin && !isAssignee) {
      return res.status(403).json({ message: "Only the assignee or an admin can change status" });
    }

    bug.status = status;
    await bug.save();
    res.json(bug);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteBug = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid bug id" });
    }

    const bug = await Bug.findByIdAndDelete(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }
    await Comment.deleteMany({ bug: bug._id });
    res.json({ message: "Bug deleted" });
  } catch (error) {
    handleError(res, error);
  }
};