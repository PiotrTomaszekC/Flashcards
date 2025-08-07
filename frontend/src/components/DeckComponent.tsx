import { FaEdit, FaFile, FaPlus, FaTrash } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { Link } from "react-router-dom";
import type { Deck, Flashcard } from "../types";
import axios from "axios";

interface DeckComponentProps {
  deck: Deck;
  flashcards: Flashcard[];
  setEditingDeck: (deck: Deck | null) => void;
  setDeletingDeck: (deck: Deck | null) => void;
}

export default function DeckComponent({
  deck,
  flashcards,
  setEditingDeck,
  setDeletingDeck,
}: DeckComponentProps) {
  async function handleExportCSV(deckId: string, deckName: string) {
    try {
      const { data } = await axios.get(`/api/sets/${deckId}/export-csv`, {
        responseType: "blob", //Tells axios to expect binary data (not JSON or text)
      });
      const blob = new Blob([data], { type: "text/csv" }); //Wraps the CSV data in a Blob object.
      const url = window.URL.createObjectURL(blob); //Creates a temporary URL pointing to that blob so it can be downloaded.
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${deckName}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove(); //Creates a hidden <a> tag, sets its href to the blob URL and download attribute to the desired filename, appends it to the DOM, clicks it programmatically, and removes it.
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
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
        {deck.sourceLanguage.name} →
        <span className="ml-2 mr-2">{deck.targetLanguage.flag}</span>
        {deck.targetLanguage.name}
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
            onClick={() => handleExportCSV(deck._id, deck.name)}
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
          // onClick={() => handleDelete(deck._id)}
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
          Learn
        </Link>
      </div>
    </div>
  );
}
