import asyncHandler from "../middleware/asyncHandler.js";
import Set from "../models/setModel.js";

//@desc Get logged in user sets
//@route GET /api/sets
//@access Private
const getMySets = asyncHandler(async (req, res) => {
  const sets = await Set.find({ user: req.user._id });
  res.status(200).json(sets);
});

//@desc Get set by ID
//@route GET /api/sets/:id
//@access Private
const getSetById = asyncHandler(async (req, res) => {
  const set = await Set.findById(req.params.id);

  if (set) {
    res.status(200).json(set);
  } else {
    res.status(404);
    throw new Error("Set not found");
  }
});

//@desc Create new set
//@route POST /api/sets
//@access Private
const addSet = asyncHandler(async (req, res) => {
  const { name, description, sourceLanguage, targetLanguage } = req.body;
  const setExists = await Set.findOne({
    user: req.user._id,
    name,
    sourceLanguage,
    targetLanguage,
  });

  if (setExists) {
    res.status(400);
    throw new Error("Set already exists");
  }

  const newSet = await Set.create({
    user: req.user._id,
    name,
    description,
    sourceLanguage,
    targetLanguage,
  });
  res.status(201).json(newSet);
});

//@desc Edit set
//@route PUT /api/sets/:id
//@access Private
const editSet = asyncHandler(async (req, res) => {
  const set = await Set.findById(req.params.id);

  if (set) {
    set.name = req.body.name || set.name;
    set.description = req.body.description || set.description;

    const updatedSet = await set.save();

    res.status(200).json(updatedSet);
  } else {
    res.status(404);
    throw new Error("Set not found");
  }
});

//@desc Delete set
//@route DELETE /api/sets/:id
//@access Private
const deleteSet = asyncHandler(async (req, res) => {
  const set = await Set.findById(req.params.id);

  if (set) {
    await Set.deleteOne({ _id: set._id });
    res.status(200).json({ message: "Product deleted" });
  } else {
    res.status(404);
    throw new Error("Set not found");
  }
});

export { getMySets, getSetById, addSet, editSet, deleteSet };
