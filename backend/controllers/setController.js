import asyncHandler from "../middleware/asyncHandler.js";
import Card from "../models/cardModel.js";
import Set from "../models/setModel.js";
import { Parser } from "json2csv";
import csv from "csv-parser";
import { Readable } from "stream";

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
    set.sourceLanguage = req.body.sourceLanguage || set.sourceLanguage;
    set.targetLanguage = req.body.targetLanguage || set.targetLanguage;

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
    await Card.deleteMany({ set: set._id });
    await Set.deleteOne({ _id: set._id });
    res.status(200).json({ message: "Set and associated flashcards deleted" });
  } else {
    res.status(404);
    throw new Error("Set not found");
  }
});

//@desc Export set as CSV
//@route GET /api/sets/:id/export-csv
//@access Private
const exportSet = asyncHandler(async (req, res) => {
  const set = await Set.findById(req.params.id);
  const flashcards = await Card.find({ set: set._id });

  if (set) {
    const fields = [
      "word",
      "translation",
      "remember",
      "repetitions",
      "rememberedCount",
    ];
    const parser = new Parser({ fields }); //Creates CSV parser using the json2csv library, includes the fields we've defined
    const csv = parser.parse(flashcards); //Converts the array of flashcard objects into a csv string - each object becomes a row, and each field a column

    res.header("Content-Type", "text/csv"); //Tells the browser that the response is a CSV file.
    res.attachment(`${set.name}.csv`); //Sets the filename for the download (e.g., Animals.csv) and tells the browser to treat the response as a file attachment
    res.send(csv); //Sends the CSV string as the response body, triggering the download.
  } else {
    res.status(404);
    throw new Error("Set not found");
  }
});

//@desc Import set from CSV
//@route POST /api/sets/import-csv
//@access Private
const importSet = asyncHandler(async (req, res) => {
  const { name, description, sourceLanguage, targetLanguage } = req.body;
  //req.file - uploaded CSV file

  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const set = await Set.create({
    user: req.user._id,
    name,
    description,
    sourceLanguage: JSON.parse(sourceLanguage),
    targetLanguage: JSON.parse(targetLanguage),
  }); //new Set is created in the database using the provided data

  const flashcards = [];
  const stream = Readable.from(req.file.buffer); //The CSV file is read usig a stream

  stream
    .pipe(csv())
    .on("data", (row) => {
      const requiredFields = ["word", "translation"];
      const missingFields = requiredFields.filter((field) => !row[field]); //checks if the row contains all required fields - if not, returns and this row is skipped

      if (missingFields.length > 0) {
        return; //
      }

      flashcards.push({
        //each row is transformed into a flashcard object and pushed into an array
        user: req.user._id,
        set: set._id,
        word: row.word,
        translation: row.translation,
        remember: row.remember === "true",
        repetitions: parseInt(row.repetitions) || 0,
        rememberedCount: parseInt(row.rememberedCount) || 0,
      });
    })
    .on("end", async () => {
      //once the CSV is fully parsed all flashcards are inserted into the database
      await Card.insertMany(flashcards);
      res
        .status(201)
        .json({ message: "Set imported successfully", setId: set._id });
    })
    .on("error", (err) => {
      res.status(500);
      throw new Error("Failed to parse CSV");
    });
});

export {
  getMySets,
  getSetById,
  addSet,
  editSet,
  deleteSet,
  exportSet,
  importSet,
};
