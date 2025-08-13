import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/authContext";
import {
  createDeck,
  deleteDeck,
  editDeck,
  exportSetCSV,
  fetchDeck,
  fetchDecks,
  importSetCSV,
} from "../services/decks";
import { toast } from "react-toastify";
import axios from "axios";
import { useTranslation } from "react-i18next";

export function useDecks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["decks"],
    queryFn: fetchDecks,
    // with enabled set to !!user the query only runs if user is truthy (logged in)
    enabled: !!user,
  });
}

export function useDeck(deckId: string) {
  return useQuery({
    queryKey: ["deck", deckId],
    queryFn: () => fetchDeck(deckId),
  });
}

export function useEditDeck() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: editDeck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      toast.success(t("toasts.deckEdited"));
    },
  });
}

export function useCreateDeck() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: createDeck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      toast.success(t("toasts.deckCreated"));
    },
  });
}

export function useDeleteDeck() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: deleteDeck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      toast.success(t("toasts.deckFlashcardsDeleted"));
    },
  });
}

export function useImportDeck() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: importSetCSV,
    onSuccess: () => {
      toast.success(t("toasts.deckImported"));
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
    onError: (error: unknown) => {
      let errorMessage = "Error importing CSV.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    },
  });
}

export function useExportDeckCSV() {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async ({
      deckId,
      deckName,
    }: {
      deckId: string;
      deckName: string;
    }) => {
      const blob = await exportSetCSV(deckId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${deckName}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    onSuccess: () => {
      toast.success(t("toasts.deckExported"));
    },
    onError: (error: unknown) => {
      let errorMessage = "Error exporting CSV.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    },
  });
}
