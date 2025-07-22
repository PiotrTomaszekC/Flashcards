import asyncHandler from "../middleware/asyncHandler.js";
import Card from "../models/cardModel.js";

//@desc Get all flashcards (if set is in query then flashcards of this set)
//@route GET /api/flashcards
//@access Private
const getFlashcards = asyncHandler(async (req, res) => {
  const { setId } = req.query;
  //req.query is an object that holds query string parameters from the URL.
  const userId = req.user._id;

  let query = { user: userId };
  if (setId) {
    query.set = setId;
  }

  const flashcards = await Card.find(query);
  res.json(flashcards);
});

//@desc Get flashcard
//@route GET /api/flashcards/:id
//@access Private
const getFlashcardById = asyncHandler(async (req, res) => {
  const flashcard = await Card.findById(req.params.id);
  if (flashcard) {
    return res.json(flashcard);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

//@desc Update flashcard
//@route PUT /api/flashcards/:id
//@access Private
const updateFlashcard = asyncHandler(async (req, res) => {
  const flashcard = await Card.findById(req.params.id);
  if (flashcard) {
    flashcard.remember = req.body.remember;
    flashcard.repetitions += 1;
    if (req.body.remember === true) {
      flashcard.rememberedCount += 1;
    }
    const updatedFlashcard = await flashcard.save();
    res.status(200).json(updatedFlashcard);
  } else {
    res.status(404);
    throw new Error("Set not found");
  }
});

//@desc Create flashcard
//@route POST /api/flashcards
//@access Private
const createFlashcard = asyncHandler(async (req, res) => {
  const { set, word, translation, remember } = req.body;
  const cardExists = await Card.findOne({
    user: req.user._id,
    set,
    word,
    translation,
  });

  if (cardExists) {
    res.status(400);
    throw new Error("Card already exists in this set");
  }

  const newCard = await Card.create({
    user: req.user._id,
    set,
    word,
    translation,
    remember,
  });
  res.status(201).json(newCard);
});

//@desc Delete flashcard
//@route DELETE /api/flashcards/:id
//@access Private
const deleteFlashcard = asyncHandler(async (req, res) => {
  const flashcard = await Card.findById(req.params.id);
  if (flashcard) {
    await Card.deleteOne({ _id: flashcard.id });
    res.status(200).json({ message: "Flashcard deleted" });
  } else {
    res.status(404);
    throw new Error("Flashcard not found");
  }
});

export {
  getFlashcards,
  getFlashcardById,
  updateFlashcard,
  createFlashcard,
  deleteFlashcard,
};
