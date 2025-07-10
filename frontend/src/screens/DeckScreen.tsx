import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Deck } from "../types";
import axios from "axios";
import Loader from "../components/Loader";
import type { Flashcard } from "../types";
import FlashcardComponent from "../components/FlashcardComponent";

export default function DeckScreen() {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    async function fetchDeckAndCards() {
      try {
        const { data: deckData } = await axios.get(`/api/sets/${id}`);
        setDeck(deckData);

        const { data: flashcardsData } = await axios.get(
          `/api/flashcards?setId=${id}`
        );
        setFlashcards(flashcardsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDeckAndCards();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load deck information.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <h1 className="uppercase text-4xl font-semibold text-center">
        {deck.name} ({deck.sourceLanguage.flag} → {deck.targetLanguage.flag}){" "}
      </h1>

      {flashcards.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-20">
          No flashcards in this set yet.
        </p>
      ) : (
        <FlashcardComponent flashcards={flashcards} />
      )}
    </div>
  );
}
