import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
        const shuffled = [...flashcardsData].sort(() => Math.random() - 0.5);
        setFlashcards(shuffled);
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
      <div className="flex items-center justify-center min-h-[60vh]">
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
    <div className="flex flex-col">
      <div className="sm:relative flex max-sm:flex-col max-sm:gap-3 justify-center items-center">
        <h1 className="uppercase text-4xl font-semibold">
          {deck.name} ({deck.sourceLanguage.flag} → {deck.targetLanguage.flag})
        </h1>
        <Link
          to={`/addCard?deck=${id}`}
          className="sm:absolute sm:right-0 bg-green-500 hover:bg-green-600 text-white transition-colors font-semibold px-4 py-2 rounded text-xl cursor-pointer"
        >
          + Add Flashcard
        </Link>
      </div>

      {flashcards.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-20">
          No flashcards in this set yet.
        </p>
      ) : (
        <div className="flex justify-center mt-10 w-full h-full">
          <FlashcardComponent
            flashcards={flashcards}
            setFlashcards={setFlashcards}
          />
        </div>
      )}
    </div>
  );
}
