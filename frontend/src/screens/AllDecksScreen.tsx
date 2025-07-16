import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import ModalEditDeck from "../components/ModalEditDeck";
import type { Deck, Flashcard } from "../types";
import ModalCreateDeck from "../components/ModalCreateDeck";
import { toast } from "react-toastify";
import { FaFile } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Loader from "../components/Loader";

export default function AllDecksScreen() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  async function handleDelete(deckId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this deck with associated flashcards?"
    );
    if (confirmed) {
      await axios.delete(`/api/sets/${deckId}`);
      toast.success("Deck and flashcards deleted");
      setDecks((prev) => prev.filter((deck) => deck._id !== deckId));
    }
  }

  function saveDeckToLocalStorage(deck: Deck) {
    const storedDecks = JSON.parse(localStorage.getItem("recentDecks") || "[]");
    const exists = storedDecks.some((d: Deck) => d._id === deck._id);
    if (!exists) {
      const updatedDecks = [deck, ...storedDecks].slice(0, 3);
      localStorage.setItem("recentDecks", JSON.stringify(updatedDecks));
    }
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="sm:relative flex max-sm:flex-col max-sm:gap-3 justify-center items-center">
        <h1 className="uppercase text-4xl font-semibold">Decks</h1>
        <button
          className=" sm:absolute sm:right-0 bg-green-500 hover:bg-green-600 text-white transition-colors font-semibold px-4 py-2 rounded text-xl cursor-pointer"
          onClick={() => setIsCreatingDeck(true)}
        >
          + Add Deck
        </button>
      </div>

      {!decks.length ? (
        <div className="items-center text-lg mt-20 flex flex-col">
          <p> You have no decks yet.</p>
          <button
            onClick={() => setIsCreatingDeck(true)}
            className="text-white bg-blue-500 hover:bg-blue-600 transition-colors px-3 py-2 rounded-md font-semibold mt-2 cursor-pointer text-2xl"
          >
            Create a Deck
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mt-4">
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

              <div className="flex justify-end gap-2 items-center">
                <div className="p-2 flex items-center gap-1 mr-auto text-xl">
                  {flashcards.filter((card) => card.set === deck._id).length}
                  <FaFile />
                </div>
                <Link
                  to={`/addCard?deck=${deck._id}`}
                  className="bg-transparent hover:bg-blue-200 p-2 rounded transition-colors cursor-pointer text-xl"
                >
                  <FaPlus />
                </Link>
                <button
                  className="bg-transparent hover:bg-blue-200 p-2 rounded transition-colors cursor-pointer text-xl"
                  onClick={() => {
                    setEditingDeck(deck);
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  className=" bg-transparent hover:bg-blue-200 p-2 rounded transition-colors cursor-pointer text-xl"
                  onClick={() => handleDelete(deck._id)}
                >
                  <FaTrash />
                </button>
                <Link
                  to={`/decks/${deck._id}`}
                  onClick={() => saveDeckToLocalStorage(deck)}
                  className="bg-blue-500 px-3 py-2 rounded-md hover:bg-blue-600 transition-colors text-white font-semibold text-xl text-center"
                >
                  Learn
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

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
