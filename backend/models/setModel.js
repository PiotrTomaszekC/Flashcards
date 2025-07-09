import mongoose from "mongoose";

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  flag: {
    type: String,
    required: true,
  },
});

const setSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    sourceLanguage: {
      type: languageSchema,
      required: true,
    },
    targetLanguage: {
      type: languageSchema,
      required: true,
    },
  },
  { timestamps: true }
);

const Set = mongoose.model("Set", setSchema);

export default Set;
