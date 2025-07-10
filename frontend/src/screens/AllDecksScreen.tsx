import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import ModalEditDeck from "../components/ModalEditDeck";
import type { Deck } from "../types";
import ModalCreateDeck from "../components/ModalCreateDeck";
import { toast } from "react-toastify";

export default function AllDecksScreen() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);

  useEffect(function () {
    const fetchDecks = async function () {
      const { data } = await axios.get("/api/sets");
      setDecks(data);
    };
    fetchDecks();
  }, []);

  async function handleDelete(deckId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this deck?"
    );
    if (confirmed) {
      await axios.delete(`/api/sets/${deckId}`);
      toast.success("Deck deleted");
      setDecks((prev) => prev.filter((deck) => deck._id !== deckId));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex justify-center items-center">
        <h1 className="uppercase text-4xl font-semibold">Decks</h1>
        <button
          className=" absolute right-0 bg-green-500 hover:bg-green-600 text-white transition-colors font-semibold px-4 py-2 rounded text-xl"
          onClick={() => setIsCreatingDeck(true)}
        >
          + Add Deck
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16 mt-4">
        {decks.map((deck) => (
          <div
            key={deck._id}
            className="bg-blue-100 rounded-md p-4 transform transition-transform duration-300 hover:scale-105"
          >
            <h3 className="text-center font-semibold text-2xl mb-2">
              {deck.name}
            </h3>

            <p className="text-center text-lg mb-2">
              <span className="mr-2">{deck.sourceLanguage.flag}</span>
              {deck.sourceLanguage.name} →
              <span className="ml-2 mr-2">{deck.targetLanguage.flag}</span>
              {deck.targetLanguage.name}
            </p>

            <p className="text-center text-lg mb-2">{deck.description}</p>

            <div className="flex justify-end gap-2">
              <button
                className="bg-transparent hover:bg-blue-200 p-2 rounded transition-colors"
                onClick={() => {
                  setEditingDeck(deck);
                }}
              >
                <FaEdit />
              </button>
              <button
                className=" bg-transparent hover:bg-blue-200 p-2 rounded transition-colors"
                onClick={() => handleDelete(deck._id)}
              >
                <FaTrash />
              </button>
              <Link
                to={`/decks/${deck._id}`}
                className="bg-blue-500 px-2 py-1 rounded-md hover:bg-blue-600 transition-colors text-white font-semibold text-xl"
              >
                Learn
              </Link>
            </div>
          </div>
        ))}
      </div>
      {editingDeck && (
        <ModalEditDeck
          editingDeck={editingDeck}
          setEditingDeck={setEditingDeck}
          updateDecks={setDecks}
        />
      )}
      {isCreatingDeck && (
        <ModalCreateDeck
          setIsCreatingDeck={setIsCreatingDeck}
          updateDecks={setDecks}
        />
      )}
    </div>
  );
}
