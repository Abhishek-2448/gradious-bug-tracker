import Bug from "../models/Bug.js";

// Counts bugs grouped by a field, with zeros for values that have no bugs.
const countBy = async (field, values) => {
  const rows = await Bug.aggregate([
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
  ]);
  const result = Object.fromEntries(values.map((value) => [value, 0]));
  rows.forEach((row) => {
    result[row._id] = row.count;
  });
  return result;
};

export const getStats = async (req, res) => {
  const [total, byStatus, bySeverity, myReported, assignedToMe] = await Promise.all([
    Bug.countDocuments(),
    countBy("status", Bug.schema.path("status").enumValues),
    countBy("severity", Bug.schema.path("severity").enumValues),
    Bug.countDocuments({ reporter: req.user.id }),
    Bug.find({ assignee: req.user.id, status: { $nin: ["resolved", "closed"] } })
      .populate("project", "name")
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  res.json({ total, byStatus, bySeverity, myReported, assignedToMe });
};
