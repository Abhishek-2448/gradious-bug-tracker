import mongoose from "mongoose";
import Bug from "../models/Bug.js";
import Comment from "../models/Comment.js";

// Returns an error response if the bug id is bad or the bug is missing.
const checkBug = async (id, res) => {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid bug id" });
    return false;
  }
  if (!(await Bug.exists({ _id: id }))) {
    res.status(404).json({ message: "Bug not found" });
    return false;
  }
  return true;
};

export const getComments = async (req, res) => {
  const { id } = req.params;
  if (!(await checkBug(id, res))) return;

  const comments = await Comment.find({ bug: id }).sort({ createdAt: 1 });
  res.json(comments);
};

export const addComment = async (req, res) => {
  const { id } = req.params;
  if (!(await checkBug(id, res))) return;

  const text = typeof req.body.text === "string" ? req.body.text.trim() : "";
  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }
  if (text.length > 1000) {
    return res.status(400).json({ message: "Comment must be 1000 characters or less" });
  }

  const comment = await Comment.create({
    bug: id,
    author: req.user.id,
    authorName: req.user.name,
    text,
  });
  res.status(201).json(comment);
};
