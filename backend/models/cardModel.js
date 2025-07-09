import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    set: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Set",
    },
    word: { type: String, required: true },
    translation: { type: String, required: true },
    // category: { type: String, required: true },
    remember: { type: Boolean, required: true },
    repetitions: { type: Number, default: 0 },
    rememberedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);

export default Card;
