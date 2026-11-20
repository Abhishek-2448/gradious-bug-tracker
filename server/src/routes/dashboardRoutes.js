import express from "express";
import { identifyUser } from "../middleware/auth.js";
import { getStats } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", identifyUser, getStats);

export default router;
