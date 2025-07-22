import mongoose from "mongoose";

const studyStatsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  dailyGoal: { type: Number, default: 20 },
  progress: [
    {
      date: { type: String, required: true },
      repetitions: { type: Number, default: 0 },
      streakUpdated: { type: Boolean, default: false },
    },
  ],
  studyStreak: { type: Number, default: 0 },
  lastStudyDate: { type: String },
});

const StudyStats = mongoose.model("StudyStats", studyStatsSchema);

export default StudyStats;
