import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FlashcardComponent from "../components/FlashcardComponent";
import Loader from "../components/Loader";
import { useDecks } from "../hooks/useDecks";
import { useFlashcards } from "../hooks/useFlashcards";
import { useTranslation } from "react-i18next";

export default function LearnSreen() {
  const { t } = useTranslation();
  const [isChosen, setIsChosen] = useState(false);
  const [languagePair, setLanguagePair] = useState("");
  const { data: decks = [], isLoading: loadingDecks } = useDecks();
  const { data: flashcards = [], isLoading: loadingFlashcards } =
    useFlashcards();
  const isLoading = loadingDecks || loadingFlashcards;

  // Set default language pair once decks are loaded
  useEffect(() => {
    if (decks.length > 0 && !languagePair) {
      const firstPair = `${decks[0].sourceLanguage.name}-${decks[0].targetLanguage.name}`;
      setLanguagePair(firstPair);
    }
  }, [decks, languagePair]);

  const [sourceLang, targetLang] = languagePair.split("-");
  const filteredDecksIds = decks
    .filter(
      (deck) =>
        deck.sourceLanguage.name === sourceLang &&
        deck.targetLanguage.name === targetLang
    )
    .map((deck) => deck._id);
  const filteredFlashcards = flashcards.filter((card) =>
    filteredDecksIds.includes(card.set)
  );

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="uppercase text-4xl font-semibold text-center">
        {t("learn")}
      </h1>
      {!decks.length ? (
        <div className="items-center text-lg mt-20 flex flex-col">
          <p className="max-sm:text-center">{t("addDeckCards")}</p>
          <Link
            to="/decks"
            className="text-white bg-blue-500 hover:bg-blue-600 transition-colors px-3 py-2 rounded-md font-semibold mt-2 cursor-pointer text-2xl"
          >
            {t("addDeck")}
          </Link>
        </div>
      ) : !flashcards.length ? (
        <div className="items-center text-lg mt-20 flex flex-col">
          <p>{t("noFlashcards")}</p>
          <Link
            to="/addCard"
            className="text-white bg-blue-500 hover:bg-blue-600 transition-colors px-3 py-2 rounded-md font-semibold mt-2 cursor-pointer text-2xl"
          >
            {t("addCard")}
          </Link>
        </div>
      ) : !isChosen ? (
        <div className="bg-white flex flex-col w-full sm:w-max mx-auto px-8 py-6 mt-10 text-xl gap-3 rounded-md shadow-md">
          <label htmlFor="languagePair" className="max-sm:text-center">
            {t("chooseLng")}
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
                {t(`languagesO.${pair.sourceLanguage}`)} →{" "}
                {t(`languagesO.${pair.targetLanguage}`)}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-max mx-auto px-4 py-2 cursor-pointer font-semibold"
            onClick={() => setIsChosen(true)}
          >
            {t("learn")}
          </button>
        </div>
      ) : (
        <div className="flex justify-center mt-10 w-full h-full">
          <FlashcardComponent flashcards={filteredFlashcards} />
        </div>
      )}
    </div>
  );
}
