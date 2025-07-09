import express from "express";
import { protect } from "./../middleware/authMiddleware.js";
import {
  addSet,
  deleteSet,
  editSet,
  getMySets,
  getSetById,
} from "../controllers/setController.js";

const router = express.Router();

router.route("/").get(protect, getMySets).post(protect, addSet);
router
  .route("/:id")
  .get(protect, getSetById)
  .put(protect, editSet)
  .delete(protect, deleteSet);

export default router;
