import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/authContext";
import { fetchStudyStats, updateDailyGoal } from "../services/studyStats";

//Query: Fetch study stats
export function useStudyStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["studyStats"],
    queryFn: fetchStudyStats,
    enabled: !!user,
  });
}

//Mutation: update daily goal
export function useUpdateDailyGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDailyGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyStats"] });
    },
  });
}
