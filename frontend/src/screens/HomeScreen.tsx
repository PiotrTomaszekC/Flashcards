import { type ReactNode } from "react";
import { BsCollectionFill } from "react-icons/bs";
import { FaCheck, FaFile, FaPercent } from "react-icons/fa";
import { FiRepeat } from "react-icons/fi";
import { GoChevronRight } from "react-icons/go";
import { IoLanguage } from "react-icons/io5";
import { Link } from "react-router-dom";
import GoalAndStreak from "../components/GoalAndStreak";
import Loader from "../components/Loader";
import { useDecks } from "../hooks/useDecks";
import { useFlashcards } from "../hooks/useFlashcards";
import { useStudyStats } from "../hooks/useStudyStats";
import { useUsers } from "../hooks/useUsers";
import type { Deck } from "../types";
import { useTranslation } from "react-i18next";

interface StatProps {
  children: ReactNode;
  text: string;
  color: string;
}

export default function HomeScreen() {
  const { data: decks = [], isLoading: decksLoading } = useDecks();
  const { data: flashcards = [], isLoading: flashcardsLoading } =
    useFlashcards();
  const { data: studyStats = null, isLoading: statsLoading } = useStudyStats();
  const { data: userProfile, isLoading: userLoading } = useUsers();
  const { t } = useTranslation();

  const isLoading =
    decksLoading || flashcardsLoading || statsLoading || userLoading;

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );

  const recentDeckIds = userProfile?.recentDecks ?? [];
  const recentDecks = recentDeckIds
    .map((id) => decks.find((deck) => deck._id === id))
    .filter((deck): deck is Deck => Boolean(deck));

  const dailyGoal = studyStats?.dailyGoal ?? 0;
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

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="bg-blue-100 py-2 rounded-md w-full lg:w-4/5 px-8">
        <h2 className="uppercase text-2xl text-blue-700 font-bold">
          {t("yourStats")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-30 gap-y-4 lg:gap-y-8 mt-4">
          <Stat text={`${decks.length} ${t("sets")}`} color="bg-yellow-300">
            <BsCollectionFill className="text-white text-2xl" />
          </Stat>
          <Stat text={`${languages} ${t("languages")}`} color="bg-green-400">
            <IoLanguage className="text-white text-2xl" />
          </Stat>
          <Stat text={`${flashcards.length} ${t("cards")}`} color="bg-blue-400">
            <FaFile className="text-white text-2xl" />
          </Stat>
          <Stat text={`${remembered} ${t("remembered")}`} color="bg-purple-400">
            <FaCheck className="text-white text-2xl" />
          </Stat>
          <Stat
            text={`${completion}% ${t("completion")}`}
            color="bg-orange-300"
          >
            <FaPercent className="text-white text-2xl" />
          </Stat>
          <Stat text={`${repetitions} ${t("repetitions")}`} color="bg-pink-400">
            <FiRepeat className="text-white text-2xl" />
          </Stat>
        </div>
      </div>
      <div className="bg-blue-100 py-2 rounded-md w-full lg:w-4/5 px-8">
        <h2 className="uppercase text-2xl text-blue-700 font-bold">
          {t("recentlyStudied")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-10 mt-4">
          {!recentDecks.length ? (
            <div className="bg-white rounded-md px-4 py-2 text-xl flex flex-col items-center gap-2">
              <span>{t("noRecentDecks")}</span>
              <Link
                to="/decks"
                className="text-white bg-blue-500 hover:bg-blue-600 transition-colors px-2 py-1 rounded-md"
              >
                {t("goToDecks")}
              </Link>
            </div>
          ) : (
            recentDecks.map((deck) => (
              <Link
                to={`/decks/${deck._id}`}
                key={deck._id}
                className="bg-white rounded-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-blue-600 hover:text-white transition-colors w-full"
              >
                <div className="flex flex-col items-center sm:items-start">
                  <h4 className="font-semibold text-2xl">{deck.name}</h4>
                  <p>
                    {t(`languagesO.${deck.sourceLanguage.name}`)} →{" "}
                    {t(`languagesO.${deck.targetLanguage.name}`)}
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
      <GoalAndStreak
        studyStats={studyStats}
        dailyGoal={dailyGoal}
        studyGoal={t("studyGoal")}
        dailyGoalS={t("dailyGoal")}
        repetitionsToday={t("repetitionsToday")}
        currentStreak={t("currentStreak")}
        day={t("day")}
      />
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
