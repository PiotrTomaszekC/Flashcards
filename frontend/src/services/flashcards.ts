import axios from "axios";
import type { Flashcard } from "../types";
import type { CardFormData } from "../validation/cardSchemas";

export async function fetchFlashcards(setId?: string): Promise<Flashcard[]> {
  const endpoint = setId ? `/api/flashcards?setId=${setId}` : "/api/flashcards";

  const { data } = await axios.get(endpoint);
  return data;
}

export async function createFlashcard(data: CardFormData) {
  await axios.post("/api/flashcards", {
    set: data.deckId,
    word: data.word,
    translation: data.translation,
    remember: data.remember,
  });
}

export async function updateFlashcard(data: {
  currentCardId: string;
  remember: boolean;
}) {
  await axios.put(`/api/flashcards/${data.currentCardId}`, {
    remember: data.remember,
  });
}

export async function deleteFlashcard(id: string) {
  await axios.delete(`/api/flashcards/${id}`);
}
