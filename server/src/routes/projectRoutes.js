import express from "express";
import { identifyUser, authorize } from "../middleware/auth.js";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.use(identifyUser);

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", authorize("admin"), createProject);
router.put("/:id", authorize("admin"), updateProject);
router.delete("/:id", authorize("admin"), deleteProject);

export default router;
