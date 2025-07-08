import asyncHandler from "../middleware/asyncHandler.js";
import Card from "../models/cardModel.js";

const getFlashcards = asyncHandler(async (req, res) => {
  const flashcards = await Card.find({});
  res.json(flashcards);
});

const getFlashcardById = asyncHandler(async (req, res) => {
  const flashcard = await Card.findById(req.params.id);
  if (flashcard) {
    return res.json(flashcard);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

export { getFlashcards, getFlashcardById };
