import asyncHandler from "../middleware/asyncHandler.js";
import Card from "../models/cardModel.js";

const getFlashcards = asyncHandler(async (req, res) => {
  const { setId } = req.query;
  //req.query is an object that holds query string parameters from the URL.
  const userId = req.user._id;

  let query = { user: userId };
  if (setId) {
    query.set = setId;
  }
  const flashcards = await Card.find(query);

  if (flashcards.length === 0) {
    res.status(404);
    throw new Error("No flashcards found for this set or user");
  }

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
