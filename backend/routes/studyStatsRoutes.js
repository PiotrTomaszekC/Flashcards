import express from "express";
import {
  addProgress,
  getStudyStats,
  updateDailyGoal,
} from "../controllers/studyStatsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router
  .route("/")
  .get(protect, getStudyStats)
  .put(protect, updateDailyGoal)
  .post(protect, addProgress);

export default router;
