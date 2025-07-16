import { BsCollectionFill } from "react-icons/bs";
import { IoLanguage } from "react-icons/io5";
import { FaFile } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FiRepeat } from "react-icons/fi";
import { FaPercent } from "react-icons/fa";
import { useEffect, useState, type ReactNode } from "react";
import { type Flashcard, type Deck } from "../types";
import axios from "axios";
import Loader from "../components/Loader";
import { GoChevronRight } from "react-icons/go";
import { Link } from "react-router-dom";
import GoalAndStreak from "../components/GoalAndStreak";

interface StatProps {
  children: ReactNode;
  text: string;
  color: string;
}

export default function HomeScreen() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function () {
    async function fetchDeckAndCards() {
      try {
        const { data: decksData } = await axios.get("/api/sets");
        setDecks(decksData);
        const { data: flashcardsData } = await axios.get("/api/flashcards");
        setFlashcards(flashcardsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDeckAndCards();
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );

  const languages = [...new Set(decks.map((deck) => deck.targetLanguage.name))]
    .length;
  const remembered = flashcards.filter((card) => card.remember === true).length;
  const percentage = flashcards.length
    ? (remembered / flashcards.length) * 100
    : 0;
  const completion = Number.isInteger(percentage)
    ? percentage.toString()
    : percentage.toFixed(2);
  const repetitions = flashcards.reduce(
    (acc, card) => acc + card.repetitions,
    0
  );
  const lastDecks: Deck[] = JSON.parse(
    localStorage.getItem("recentDecks") || "[]"
  );

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="bg-blue-100 py-2 rounded-md w-full lg:w-4/5 px-8">
        <h2 className="uppercase text-2xl text-blue-700 font-bold">
          Your stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-30 gap-y-4 lg:gap-y-8 mt-4">
          <Stat text={`${decks?.length} Sets`} color="bg-yellow-300">
            <BsCollectionFill className="text-white text-2xl" />
          </Stat>
          <Stat text={`${languages} Languages`} color="bg-green-400">
            <IoLanguage className="text-white text-2xl" />
          </Stat>
          <Stat text={`${flashcards?.length} Cards`} color="bg-blue-400">
            <FaFile className="text-white text-2xl" />
          </Stat>
          <Stat text={`${remembered} Remembered`} color="bg-purple-400">
            <FaCheck className="text-white text-2xl" />
          </Stat>
          <Stat text={`${completion}% Completion`} color="bg-orange-300">
            <FaPercent className="text-white text-2xl" />
          </Stat>
          <Stat text={`${repetitions} Repetitions`} color="bg-pink-400">
            <FiRepeat className="text-white text-2xl" />
          </Stat>
        </div>
      </div>
      <div className="bg-blue-100 py-2 rounded-md w-full lg:w-4/5 px-8">
        <h2 className="uppercase text-2xl text-blue-700 font-bold">
          Recently studied decks
        </h2>
        <div className="flex max-sm:flex-col gap-4 lg:gap-10 mt-4">
          {!lastDecks.length ? (
            <div className="bg-white rounded-md px-4 py-2 text-xl flex flex-col items-center gap-2">
              <span>You haven't studied any decks yet.</span>
              <Link
                to="/decks"
                className="text-white bg-blue-500 hover:bg-blue-600 transition-colors px-2 py-1 rounded-md"
              >
                Go to Decks
              </Link>
            </div>
          ) : (
            lastDecks.map((deck) => (
              <Link
                to={`/decks/${deck._id}`}
                key={deck._id}
                className="bg-white rounded-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-blue-300 transition-colors w-full"
              >
                <div className="flex flex-col items-center sm:items-start">
                  <h4 className="font-semibold text-2xl">{deck.name}</h4>
                  <p>
                    {deck.sourceLanguage.name} → {deck.targetLanguage.name}
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <GoChevronRight className="text-4xl" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
      <GoalAndStreak />
    </div>
  );
}

function Stat({ children, text, color }: StatProps) {
  return (
    <div className="bg-white rounded-md px-4 py-2 flex items-center gap-4">
      <div
        className={`${color} rounded-full w-12 h-12 aspect-square flex items-center justify-center`}
      >
        {children}
      </div>
      <span className="text-xl font-semibold text-gray-800">{text}</span>
    </div>
  );
}
