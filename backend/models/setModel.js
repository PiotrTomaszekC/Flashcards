import mongoose from "mongoose";

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
    // sourceLanguage: {
    //   type: String,
    //   required: true,
    // },
    // targetLanguage: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

const Set = mongoose.model("Set", setSchema);

export default Set;
