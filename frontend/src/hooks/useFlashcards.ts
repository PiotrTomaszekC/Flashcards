import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import {
  createFlashcard,
  deleteFlashcard,
  fetchFlashcards,
  updateFlashcard,
} from "../services/flashcards";
import { useTranslation } from "react-i18next";

export function useFlashcards(setId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["flashcards", setId],
    queryFn: () => fetchFlashcards(setId),
    enabled: !!user,
    // select: (data) => {
    //   if (setId) {
    //     return [...data].sort(() => Math.random() - 0.5);
    //   }
    //   return data;
    // },
  });
}

export function useCreateFlashcard() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: createFlashcard,
    onSuccess: () => {
      toast.success(t("toasts.cardAdded"));
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
    onError: (error: unknown) => {
      let errorMessage = "Something went wrong. Please try again.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    },
  });
}

export function useUpdateFlashcard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFlashcard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
    },
  });
}

export function useDeleteFlashcard() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: deleteFlashcard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      toast.success(t("toasts.flashcardDeleted"));
    },
  });
}
