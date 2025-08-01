import axios from "axios";
import { useState } from "react";
import Loader from "./Loader";
import type { Deck } from "../types";
import LANGUAGES from "../constants";
import { toast } from "react-toastify";

interface ModalCreateDeckProps {
  setIsCreatingDeck: (value: boolean) => void;
  updateDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
}

export default function ModalCreateDeck({
  setIsCreatingDeck,
  updateDecks,
}: ModalCreateDeckProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState(LANGUAGES[0]);
  const [targetLanguage, setTargetLanguage] = useState(LANGUAGES[1]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { data: newDeck } = await axios.post("/api/sets", {
      name,
      description,
      sourceLanguage,
      targetLanguage,
    });
    setIsLoading(false);
    updateDecks((prevDecks) => [...prevDecks, newDeck]);
    setIsCreatingDeck(false);
    toast.success("Deck created successfully");
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50"
      onClick={() => setIsCreatingDeck(false)}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className="bg-white p-6 rounded shadow-lg w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4">Create new Deck</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border-blue-400 border rounded-md focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
              placeholder="Deck Name"
              required
            />

            <select
              data-testid="source-language"
              value={sourceLanguage.name}
              onChange={(e) =>
                setSourceLanguage(
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
              value={targetLanguage.name}
              onChange={(e) =>
                setTargetLanguage(
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2 border-blue-400 border rounded-md focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
              placeholder="Description"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreatingDeck(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
