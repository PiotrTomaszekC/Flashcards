import express from "express";
import {
  getFlashcardById,
  getFlashcards,
} from "../controllers/flashcardController.js";
const router = express.Router();

router.route("/").get(getFlashcards);
router.route("/:id").get(getFlashcardById);

export default router;
