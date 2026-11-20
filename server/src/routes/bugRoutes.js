import express from "express";
import { identifyUser, authorize } from "../middleware/auth.js";
import {
  getBugs,
  getBugById,
  createBug,
  updateBug,
  assignBug,
  updateBugStatus,
  deleteBug,
} from "../controllers/bugController.js";
import { getComments, addComment } from "../controllers/commentController.js";

const router = express.Router();

router.use(identifyUser);

router.get("/", getBugs);
router.post("/", createBug);
router.get("/:id", getBugById);
router.put("/:id", updateBug);
router.patch("/:id/assign", authorize("admin"), assignBug);
router.patch("/:id/status", updateBugStatus);
router.delete("/:id", authorize("admin"), deleteBug);

router.get("/:id/comments", getComments);
router.post("/:id/comments", addComment);

export default router;
