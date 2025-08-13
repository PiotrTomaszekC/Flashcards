import { Link, useParams } from "react-router-dom";
import FlashcardComponent from "../components/FlashcardComponent";
import Loader from "../components/Loader";
import { useDeck } from "../hooks/useDecks";
import { useFlashcards } from "../hooks/useFlashcards";
import { useTranslation } from "react-i18next";

export default function DeckScreen() {
  const { id } = useParams();
  const { data: deck, isLoading: loadingDeck } = useDeck(id!);
  const { data: flashcards = [], isLoading: loadingFlashcards } = useFlashcards(
    id!
  );
  const { t } = useTranslation();

  const isLoading = loadingDeck || loadingFlashcards;

  if (isLoading) {
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
          {t("addCard")}
        </Link>
      </div>

      {flashcards.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-20">{t("noFinD")}</p>
      ) : (
        <div className="flex justify-center mt-10 w-full h-full">
          <FlashcardComponent flashcards={flashcards} />
        </div>
      )}
    </div>
  );
}
