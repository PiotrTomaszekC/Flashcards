import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import StudyStats from "./studyStatsModel.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: {
      data: Buffer,
      contentType: String,
    },
    recentDecks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Set",
      },
    ],
  },

  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Automatically create StudyStats after a new user is saved
userSchema.post("save", async function (doc, next) {
  try {
    const existingStats = await StudyStats.findOne({ user: doc._id });
    if (!existingStats) {
      await StudyStats.create({ user: doc._id });
    }
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
