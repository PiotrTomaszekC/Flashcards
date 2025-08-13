import { useState } from "react";
import { FaAward } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { RiProgress5Line } from "react-icons/ri";
import { useAuth } from "../context/authContext";
import { useUpdateDailyGoal } from "../hooks/useStudyStats";
import type { StudyStats } from "../types";

interface GoalAndStreakProps {
  studyStats: StudyStats | null;
  dailyGoal: number;
  studyGoal: string;
  dailyGoalS: string;
  repetitionsToday: string;
  currentStreak: string;
  day: string;
}

export default function GoalAndStreak({
  studyStats,
  dailyGoal,
  studyGoal,
  dailyGoalS,
  repetitionsToday,
  currentStreak,
  day,
}: GoalAndStreakProps) {
  const { user } = useAuth();
  const [currentDailyGoal, setCurrentDailyGoal] = useState(dailyGoal || 20);
  const today = new Date().toISOString().split("T")[0];
  const progressToday =
    studyStats?.progress?.find((p) => p.date === today) || null;

  const { mutate: updateDailyGoal } = useUpdateDailyGoal();

  function onGoalUpdate(goal: number) {
    setCurrentDailyGoal(goal);
    if (user) updateDailyGoal(goal);
  }

  return (
    <div className="bg-blue-100 py-2 rounded-md w-full lg:w-4/5 px-8 font-semibold">
      <h2 className="uppercase text-2xl text-blue-700 font-bold">
        {studyGoal}
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 lg:gap-10 mt-4">
        <div className="bg-white rounded-md px-4 py-2 flex max-lg:flex-col gap-2 items-center text-xl">
          <span className="max-lg:text-center">{dailyGoalS}</span>

          <div className="flex gap-1">
            {[20, 50, 100].map((goal) => (
              <button
                key={goal}
                onClick={() => onGoalUpdate(goal)}
                className={`${
                  currentDailyGoal === goal && "bg-blue-600 text-white"
                } hover:bg-blue-600 hover:text-white transition-colors rounded-md px-2 py-1 cursor-pointer`}
              >
                {goal}
              </button>
            ))}
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
            {progressToday ? progressToday.repetitions : 0} {repetitionsToday}
            {/* {progressToday?.repetitions === 1 ? "" : "s"} Today */}
          </span>
        </div>
        <div
          className={`bg-white rounded-md px-4 py-2 flex gap-2 items-center text-xl max-sm:justify-center`}
        >
          <GiProgression className="text-4xl" />
          <span>
            {currentStreak} {studyStats ? studyStats.studyStreak : 0} {day}
            {/* {studyStats && studyStats.studyStreak === 1 ? "" : "s"} */}
          </span>
        </div>
      </div>
    </div>
  );
}
