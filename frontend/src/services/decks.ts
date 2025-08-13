import axios from "axios";
import type { Deck, Language } from "../types";

export async function fetchDecks(): Promise<Deck[]> {
  const { data } = await axios.get("/api/sets");
  return data;
}

export async function fetchDeck(deckId: string): Promise<Deck> {
  const { data } = await axios.get(`/api/sets/${deckId}`);
  return data;
}

//async function always returns a Promise, even if we return a plain value. data returned is automatically wrapped in a Promise because of async

export async function editDeck(data: {
  deckId: string;
  name: string;
  description?: string;
  sourceLanguage: Language;
  targetLanguage: Language;
}): Promise<Deck> {
  const { data: updatedDeck } = await axios.put(`/api/sets/${data.deckId}`, {
    name: data.name,
    description: data.description,
    sourceLanguage: data.sourceLanguage,
    targetLanguage: data.targetLanguage,
  });

  return updatedDeck;
}

export async function createDeck(data: {
  name: string;
  description?: string;
  sourceLanguage: Language;
  targetLanguage: Language;
}): Promise<Deck> {
  const { data: createdDeck } = await axios.post("/api/sets", data);
  return createdDeck;
}

export async function deleteDeck(deckId: string) {
  await axios.delete(`/api/sets/${deckId}`);
}

export async function importSetCSV(formData: FormData) {
  const { data } = await axios.post("/api/sets/import-csv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function exportSetCSV(deckId: string): Promise<Blob> {
  const { data } = await axios.get(`/api/sets/${deckId}/export-csv`, {
    responseType: "blob",
  });
  return new Blob([data], { type: "text/csv" });
}
