import axios from "axios";
import type { StudyStats } from "../types";

export async function fetchStudyStats(): Promise<StudyStats> {
  const { data } = await axios.get("/api/studyStats");
  return data;
}

export async function updateDailyGoal(goal: number) {
  return axios.put("/api/studyStats", { dailyGoal: goal });
}

// export async function updateProgress(progressData: any) {
//   return axios.put("/api/studyStats/progress", progressData);
// }
