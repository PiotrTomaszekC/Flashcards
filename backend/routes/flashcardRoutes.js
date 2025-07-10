import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getFlashcardById,
  getFlashcards,
} from "../controllers/flashcardController.js";
const router = express.Router();

router.route("/").get(protect, getFlashcards);
router.route("/:id").get(protect, getFlashcardById);

export default router;
