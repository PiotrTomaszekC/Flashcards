import asyncHandler from "../middleware/asyncHandler.js";
import StudyStats from "../models/studyStatsModel.js";

//@desc Get logged in user study stats
//@route GET /api/studyStats
//@access Private
const getStudyStats = asyncHandler(async (req, res) => {
  const stats = await StudyStats.findOne({ user: req.user._id });
  res.status(200).json(stats);
});

//@desc Update study stats
//@route PUT /api/studyStats
//@access Private
const updateDailyGoal = asyncHandler(async (req, res) => {
  const stats = await StudyStats.findOne({ user: req.user._id });
  if (stats) {
    stats.dailyGoal = req.body.dailyGoal;

    const updatedStudyStats = await stats.save();
    res.status(200).json(updatedStudyStats);
  } else {
    res.status(404);
    throw new Error("Study stats not found");
  }
});

//@desc Add progress
//@route POST /api/studyStats
//@access Private
const addProgress = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const stats = await StudyStats.findOne({ user: req.user._id });

  if (stats) {
    let todayEntry = stats.progress.find((p) => p.date === today);
    if (todayEntry) {
      todayEntry.repetitions += 1;
    } else {
      todayEntry = { date: today, repetitions: 1, streakUpdated: false };
      stats.progress.push(todayEntry);
    }

    const goalMet = todayEntry.repetitions >= stats.dailyGoal;
    if (goalMet && !todayEntry.streakUpdated) {
      if (stats.lastStudyDate === yesterday) {
        stats.studyStreak += 1;
      } else {
        stats.studyStreak = 1;
      }
      stats.lastStudyDate = today;
      todayEntry.streakUpdated = true;
    }

    const updatedStats = await stats.save();
    res.status(200).json(updatedStats);
  } else {
    res.status(404);
    throw new Error("Study stats not found");
  }
});

export { getStudyStats, updateDailyGoal, addProgress };
