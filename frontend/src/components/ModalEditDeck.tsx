import axios from "axios";
import { useState } from "react";
import type { Deck } from "../types";
import Loader from "./Loader";
import LANGUAGES from "../constants";
import { toast } from "react-toastify";

interface ModalEditDeckProps {
  editingDeck: Deck;
  setEditingDeck: (deck: Deck | null) => void;
  updateDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
}

export default function ModalEditDeck({
  setEditingDeck,
  editingDeck,
  updateDecks,
}: ModalEditDeckProps) {
  const [editName, setEditName] = useState(editingDeck.name);
  const [editDescription, setEditDescription] = useState(
    editingDeck.description
  );
  const [isLoading, setIsLoading] = useState(false);
  const [editSourceLanguage, setEditSourceLanguage] = useState(
    editingDeck.sourceLanguage
  );
  const [editTargetLanguage, setEditTargetLanguage] = useState(
    editingDeck.targetLanguage
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { data: updatedDeck } = await axios.put(
      `/api/sets/${editingDeck._id}`,
      {
        name: editName,
        description: editDescription,
        sourceLanguage: editSourceLanguage,
        targetLanguage: editTargetLanguage,
      }
    );
    setIsLoading(false);

    updateDecks((prevDecks) =>
      prevDecks.map((deck) =>
        deck._id === updatedDeck._id ? updatedDeck : deck
      )
    );

    setEditingDeck(null);
    toast.success("Deck edited successfully");
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50"
      onClick={() => setEditingDeck(null)}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className="bg-white p-6 rounded shadow-lg w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4">Edit Deck</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="p-2 border-blue-400 border rounded-md focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
              placeholder="Deck Name"
            />
            <select
              data-testid="source-language"
              value={editSourceLanguage.name}
              onChange={(e) =>
                setEditSourceLanguage(
                  LANGUAGES.find((lang) => lang.name === e.target.value)!
                )
              }
              className="p-2 border-blue-400 border rounded-md focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.name} value={lang.name}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>

            <select
              data-testid="target-language"
              value={editTargetLanguage.name}
              onChange={(e) =>
                setEditTargetLanguage(
                  LANGUAGES.find((lang) => lang.name === e.target.value)!
                )
              }
              className="p-2 border-blue-400 border rounded-md focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.name} value={lang.name}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="p-2 border-blue-400 border rounded-md focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
              placeholder="Description"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingDeck(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
