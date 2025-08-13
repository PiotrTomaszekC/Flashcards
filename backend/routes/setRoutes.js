import express from "express";
import { protect } from "./../middleware/authMiddleware.js";
import upload from "./../middleware/uploadMiddleware.js";
import {
  addSet,
  deleteSet,
  editSet,
  exportSet,
  getMySets,
  getSetById,
  importSet,
} from "../controllers/setController.js";

const router = express.Router();

router.route("/").get(protect, getMySets).post(protect, addSet);
router
  .route("/:id")
  .get(protect, getSetById)
  .put(protect, editSet)
  .delete(protect, deleteSet);
// router.get("/:id/export-csv", protect, exportSet);
router.post("/import-csv", protect, upload.single("file"), importSet);

export default router;
