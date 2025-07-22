import { useEffect, useState } from "react";
import FlashcardComponent from "../components/FlashcardComponent";
import axios from "axios";
import type { Deck, Flashcard } from "../types";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

export default function LearnSreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isChosen, setIsChosen] = useState(false);
  const [languagePair, setLanguagePair] = useState("");
  const [sourceLang, targetLang] = languagePair.split("-");
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([]);

  useEffect(function () {
    async function fetchAndSortCardsAndDecks() {
      try {
        const { data: decksData } = await axios.get("/api/sets");
        const { data: flashcardsData } = await axios.get("/api/flashcards");
        const sortedFlashcards = flashcardsData.map((card: Flashcard) => {
          const ratio = card.rememberedCount / (card.repetitions + 1);
          //+1 to avoid division by 0 and to ensure the ratio starts smaller, helping prioritize new or forgotten cards
          const timeSinceUpdate = card.updatedAt
            ? Date.now() - new Date(card.updatedAt).getTime() //Date.now gives the current timestamp in milliseconds, getTime does the same with the updatedAt date
            : Number.MAX_SAFE_INTEGER; // fallback for undefined dates
          const priority =
            (1 - ratio) * 0.6 +
            timeSinceUpdate * 0.000001 +
            (card.remember ? 0 : 1);
          return { ...card, priority };
        });
        setFlashcards(sortedFlashcards);
        setDecks(decksData);

        // Set default language pair
        if (decksData.length > 0) {
          const firstPair = `${decksData[0].sourceLanguage.name}-${decksData[0].targetLanguage.name}`;
          setLanguagePair(firstPair);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAndSortCardsAndDecks();
  }, []);

  useEffect(() => {
    if (!sourceLang || !targetLang) return;

    const filteredDecksIds = decks
      .filter(
        (deck) =>
          deck.sourceLanguage.name === sourceLang &&
          deck.targetLanguage.name === targetLang
      )
      .map((deck) => deck._id);

    const filtered = flashcards.filter((card) =>
      filteredDecksIds.includes(card.set)
    );

    setFilteredFlashcards(filtered);
  }, [flashcards, sourceLang, targetLang, decks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  const uniqueLanguagePairs = [
    ...new Set(
      decks.map((deck) =>
        JSON.stringify({
          sourceLanguage: deck.sourceLanguage.name,
          targetLanguage: deck.targetLanguage.name,
        })
      )
    ),
  ].map((pair) => JSON.parse(pair));
  //JSON.stringify because we cant directly compare objects for equality, each has a unique reference. We turn them into stringsand then when we have no duplicates back into objects

  return (
    <div className="flex flex-col gap-4">
      <h1 className="uppercase text-4xl font-semibold text-center">Learn</h1>
      {!decks.length ? (
        <div className="items-center text-lg mt-20 flex flex-col">
          <p className="max-sm:text-center">
            Add a deck and some cards to start learning.
          </p>
          <Link
            to="/decks"
            className="text-white bg-blue-500 hover:bg-blue-600 transition-colors px-3 py-2 rounded-md font-semibold mt-2 cursor-pointer text-2xl"
          >
            Add a Deck
          </Link>
        </div>
      ) : !flashcards.length ? (
        <div className="items-center text-lg mt-20 flex flex-col">
          <p>You have no flashcards yet.</p>
          <Link
            to="/addCard"
            className="text-white bg-blue-500 hover:bg-blue-600 transition-colors px-3 py-2 rounded-md font-semibold mt-2 cursor-pointer text-2xl"
          >
            Add a Card
          </Link>
        </div>
      ) : !isChosen ? (
        <div className="bg-white flex flex-col w-full sm:w-max mx-auto px-8 py-6 mt-10 text-xl gap-3 rounded-md shadow-md">
          <label htmlFor="languagePair" className="max-sm:text-center">
            Choose the language pair you would like to learn:
          </label>
          <select
            id="languagePair"
            value={languagePair}
            className="border-blue-400 border rounded-md p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            onChange={(e) => setLanguagePair(e.target.value)}
          >
            {uniqueLanguagePairs.map((pair) => (
              <option
                key={`${pair.sourceLanguage}-${pair.targetLanguage}`}
                value={`${pair.sourceLanguage}-${pair.targetLanguage}`}
              >
                {pair.sourceLanguage}→{pair.targetLanguage}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-max mx-auto px-4 py-2 cursor-pointer font-semibold"
            onClick={() => setIsChosen(true)}
          >
            Learn
          </button>
        </div>
      ) : (
        <div className="flex justify-center mt-10 w-full h-full">
          <FlashcardComponent
            flashcards={filteredFlashcards}
            setFlashcards={setFilteredFlashcards}
          />
        </div>
      )}
    </div>
  );
}
