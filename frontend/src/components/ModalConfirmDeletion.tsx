import axios from "axios";
import type { Deck } from "../types";
import { toast } from "react-toastify";
import { useState } from "react";
import Loader from "./Loader";

interface ModalConfirmProps {
  deletingDeck: Deck;
  setDeletingDeck: (deck: Deck | null) => void;
  updateDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
}

export default function ModalConfirmDeletion({
  deletingDeck,
  setDeletingDeck,
  updateDecks,
}: ModalConfirmProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    await axios.delete(`/api/sets/${deletingDeck._id}`);
    toast.success("Deck and flashcards deleted");
    setIsLoading(false);
    updateDecks((prev) => prev.filter((deck) => deck._id !== deletingDeck._id));
    setDeletingDeck(null);
  }

  return (
    <div
      className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50"
      onClick={() => setDeletingDeck(null)}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className="bg-white p-6 rounded shadow-lg w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold mb-4 text-center">
            Are you sure you want to delete this deck with associated
            flashcards?
          </h3>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setDeletingDeck(null)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
              onClick={handleDelete}
            >
              Delete deck
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
