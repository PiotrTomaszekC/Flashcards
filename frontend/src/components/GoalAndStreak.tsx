import { useEffect, useState } from "react";
import { RiProgress5Line } from "react-icons/ri";
import { FaAward } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";

export default function GoalAndStreak() {
  const [dailyGoal, setDailyGoal] = useState(
    Number(localStorage.getItem("dailyGoal")) || 20
  );
  const today = new Date().toISOString().split("T")[0];
  const progressKey = `progress-${today}`;
  const todayRepetitions = Number(localStorage.getItem(progressKey)) || 0;

  function handleDailyGoal(goal: number) {
    setDailyGoal(goal);
    localStorage.setItem("dailyGoal", goal.toString());
  }

  useEffect(
    function () {
      function updateStreak() {
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .split("T")[0];
        //today and yesterday's date in YYYY-MM-DD
        const lastDate = localStorage.getItem("lastStudyDate");
        const streak = Number(localStorage.getItem("studyStreak") || 0);
        const streakUpdatedForToday =
          localStorage.getItem("streakUpdated") === today;

        if (todayRepetitions >= dailyGoal) {
          if (!streakUpdatedForToday) {
            if (lastDate === yesterday) {
              localStorage.setItem("studyStreak", (streak + 1).toString());
            } else if (lastDate !== today) {
              localStorage.setItem("studyStreak", "1");
            }
            localStorage.setItem("lastStudyDate", today);
            localStorage.setItem("streakUpdated", today);
          }
        } else {
          // If the streak was already updated today but the new goal is not met, subtract
          if (streakUpdatedForToday) {
            const newStreak = Math.max(0, streak - 1);
            localStorage.setItem("studyStreak", newStreak.toString());
            localStorage.removeItem("streakUpdated");
            localStorage.removeItem("lastStudyDate");
          }
        }
      }
      updateStreak();
    },
    [todayRepetitions, dailyGoal]
  );

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
                dailyGoal === 20 && "bg-red-500"
              } hover:bg-red-500 rounded-md px-2 py-1 cursor-pointer`}
            >
              20
            </button>
            <button
              onClick={() => handleDailyGoal(50)}
              className={`${
                dailyGoal === 50 && "bg-red-500"
              } hover:bg-red-500 rounded-md px-2 py-1 cursor-pointer`}
            >
              50
            </button>
            <button
              onClick={() => handleDailyGoal(100)}
              className={`${
                dailyGoal === 100 && "bg-red-500"
              } hover:bg-red-500 rounded-md px-2 py-1 cursor-pointer`}
            >
              100
            </button>
          </div>
        </div>
        <div
          className={`${
            todayRepetitions >= dailyGoal ? "bg-green-400" : "bg-yellow-200"
          }  rounded-md px-4 py-2 flex gap-2 max-sm:justify-center items-center text-xl`}
        >
          {todayRepetitions >= dailyGoal ? (
            <FaAward className="text-4xl" />
          ) : (
            <RiProgress5Line className="text-4xl" />
          )}

          <span>
            {todayRepetitions} Repetition{todayRepetitions === 1 ? "" : "s"}{" "}
            Today
          </span>
        </div>
        <div
          className={`bg-white rounded-md px-4 py-2 flex gap-2 items-center text-xl max-sm:justify-center`}
        >
          <GiProgression className="text-4xl" />
          <span>
            Current Streak: {localStorage.getItem("studyStreak") || 0} Day
            {Number(localStorage.getItem("studyStreak")) === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
}
