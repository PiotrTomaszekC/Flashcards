import axios from "axios";
import { FaAward } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { RiProgress5Line } from "react-icons/ri";
import type { StudyStats } from "../types";

interface GoalAndStreakProps {
  studyStats: StudyStats | null;
  dailyGoal: number;
  setDailyGoal: (value: number) => void;
}

export default function GoalAndStreak({
  studyStats,
  dailyGoal,
  setDailyGoal,
}: GoalAndStreakProps) {
  const today = new Date().toISOString().split("T")[0];
  const progressToday =
    studyStats?.progress?.find((p) => p.date === today) || null;

  async function handleDailyGoal(goal: number) {
    setDailyGoal(goal);
    if (studyStats) {
      await axios.put("/api/studyStats", { dailyGoal: goal });
    }
  }

  console.log(dailyGoal, studyStats?.dailyGoal);

  return (
    <div className="bg-blue-100 py-2 rounded-md w-full lg:w-4/5 px-8 font-semibold">
      <h2 className="uppercase text-2xl text-blue-700 font-bold">Study goal</h2>
      <div className="flex flex-col sm:flex-row gap-4 lg:gap-10 mt-4">
        <div className="bg-white rounded-md px-4 py-2 flex max-lg:flex-col gap-2 items-center text-xl">
          <span className="max-lg:text-center">
            Daily Goal (cards reviewed per day):
          </span>
          <div className="flex gap-1 ">
            <button
              onClick={() => handleDailyGoal(20)}
              className={`${
                dailyGoal === 20 && "bg-blue-600 text-white"
              } hover:bg-blue-600 hover:text-white transition-colors rounded-md px-2 py-1 cursor-pointer`}
            >
              20
            </button>
            <button
              onClick={() => handleDailyGoal(50)}
              className={`${
                dailyGoal === 50 && "bg-blue-600 text-white"
              } hover:bg-blue-600 hover:text-white transition-colors rounded-md px-2 py-1 cursor-pointer`}
            >
              50
            </button>
            <button
              onClick={() => handleDailyGoal(100)}
              className={`${
                dailyGoal === 100 && "bg-blue-600 text-white"
              } hover:bg-blue-600 hover:text-white transition-colors rounded-md px-2 py-1 cursor-pointer`}
            >
              100
            </button>
          </div>
        </div>
        <div
          className={`${
            progressToday && progressToday.repetitions >= dailyGoal
              ? "bg-green-400"
              : "bg-yellow-200"
          }  rounded-md px-4 py-2 flex gap-2 max-sm:justify-center items-center text-xl`}
        >
          {progressToday && progressToday.repetitions >= dailyGoal ? (
            <FaAward className="text-4xl" />
          ) : (
            <RiProgress5Line className="text-4xl" />
          )}

          <span>
            {progressToday ? progressToday.repetitions : 0} Repetition
            {progressToday?.repetitions === 1 ? "" : "s"} Today
          </span>
        </div>
        <div
          className={`bg-white rounded-md px-4 py-2 flex gap-2 items-center text-xl max-sm:justify-center`}
        >
          <GiProgression className="text-4xl" />
          <span>
            Current Streak: {studyStats ? studyStats.studyStreak : 0} Day
            {studyStats && studyStats.studyStreak === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
}
