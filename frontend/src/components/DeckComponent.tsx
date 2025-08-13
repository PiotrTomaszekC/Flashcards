import { FaEdit, FaFile, FaPlus, FaTrash } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { Link } from "react-router-dom";
import type { Deck, Flashcard } from "../types";
import axios from "axios";
import { useExportDeckCSV } from "../hooks/useDecks";
import { useTranslation } from "react-i18next";

interface DeckComponentProps {
  deck: Deck;
  flashcards: Flashcard[];
  setEditingDeck: (deck: Deck | null) => void;
  setDeletingDeck: (deck: Deck | null) => void;
  learn: string;
}

export default function DeckComponent({
  deck,
  flashcards,
  setEditingDeck,
  setDeletingDeck,
  learn,
}: DeckComponentProps) {
  const { mutate: exportDeck } = useExportDeckCSV();
  const { t } = useTranslation();

  function handleExportCSV() {
    exportDeck({ deckId: deck._id, deckName: deck.name });
  }

  async function saveToRecentDecks(deckId: string) {
    await axios.put("/api/users", { deckId });
  }

  return (
    <div
      key={deck._id}
      className="bg-blue-100 rounded-md p-4 transform transition-transform duration-300 hover:scale-105 flex flex-col justify-between min-h-[200px]"
    >
      <h3 className="text-center font-semibold text-2xl mb-2">{deck.name}</h3>

      <p className="text-center text-lg mb-2">
        <span className="mr-2">{deck.sourceLanguage.flag}</span>
        {t(`languagesO.${deck.sourceLanguage.name}`)} →
        <span className="ml-2 mr-2">{deck.targetLanguage.flag}</span>
        {t(`languagesO.${deck.targetLanguage.name}`)}
      </p>

      <p className="text-center text-lg mb-2">{deck.description}</p>

      <div className="flex justify-end gap-2 items-center">
        <div className="p-2 flex items-center gap-1 mr-auto text-xl">
          {flashcards.filter((card) => card.set === deck._id).length}
          <FaFile />
        </div>
        {flashcards.length && (
          <button
            className="bg-transparent hover:bg-blue-200 p-2 rounded transition-colors cursor-pointer text-xl"
            onClick={handleExportCSV}
          >
            <IoMdDownload />
          </button>
        )}

        <Link
          to={`/addCard?deck=${deck._id}`}
          data-testid={`add-card-link-${deck._id}`}
          className="bg-transparent hover:bg-blue-200 p-2 rounded transition-colors cursor-pointer text-xl"
        >
          <FaPlus />
        </Link>
        <button
          data-testid={`edit-deck-${deck._id}`}
          className="bg-transparent hover:bg-blue-200 p-2 rounded transition-colors cursor-pointer text-xl"
          onClick={() => {
            setEditingDeck(deck);
          }}
        >
          <FaEdit />
        </button>
        <button
          data-testid={`delete-deck-${deck._id}`}
          className=" bg-transparent hover:bg-blue-200 p-2 rounded transition-colors cursor-pointer text-xl"
          onClick={() => setDeletingDeck(deck)}
        >
          <FaTrash />
        </button>
        <Link
          to={`/decks/${deck._id}`}
          data-testid={`decks-link-${deck._id}`}
          onClick={() => saveToRecentDecks(deck._id)}
          className="bg-blue-500 px-3 py-2 rounded-md hover:bg-blue-600 transition-colors text-white font-semibold text-xl text-center"
        >
          {learn}
        </Link>
      </div>
    </div>
  );
}
