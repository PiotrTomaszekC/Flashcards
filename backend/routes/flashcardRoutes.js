import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createFlashcard,
  deleteFlashcard,
  getFlashcardById,
  getFlashcards,
  updateFlashcard,
} from "../controllers/flashcardController.js";
const router = express.Router();

router.route("/").get(protect, getFlashcards).post(protect, createFlashcard);
router
  .route("/:id")
  .get(protect, getFlashcardById)
  .put(protect, updateFlashcard)
  .delete(protect, deleteFlashcard);

export default router;
