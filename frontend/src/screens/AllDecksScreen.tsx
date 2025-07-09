import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import ModalEditDeck from "../components/ModalEditDeck";
import type { Deck } from "../types";
import ModalCreateDeck from "../components/ModalCreateDeck";

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
  });

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
            <h3 className="text-center font-semibold text-2xl">{deck.name}</h3>

            <p className="text-center text-lg mb-2">
              {deck.sourceLanguage.flag}
              {deck.sourceLanguage.name} → {deck.targetLanguage.flag}
              {deck.targetLanguage.name}{" "}
            </p>

            <p className="text-center ">{deck.description}</p>

            <div className="flex justify-end gap-2 mt-2">
              <button
                className=" bg-transparent hover:bg-blue-200 p-2 rounded transition-colors"
                onClick={() => {
                  setEditingDeck(deck);
                }}
              >
                <FaEdit />
              </button>
              <button className=" bg-transparent hover:bg-blue-200 p-2 rounded transition-colors">
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
        />
      )}
      {isCreatingDeck && (
        <ModalCreateDeck setIsCreatingDeck={setIsCreatingDeck} />
      )}
    </div>
  );
}
