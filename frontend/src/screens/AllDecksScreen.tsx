import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { MdFileUpload } from "react-icons/md";
import { toast } from "react-toastify";
import DeckComponent from "../components/DeckComponent";
import Loader from "../components/Loader";
import ModalConfirmDeletion from "../components/ModalConfirmDeletion";
import ModalCreateDeck from "../components/ModalCreateDeck";
import ModalEditDeck from "../components/ModalEditDeck";
import type { Deck, Flashcard } from "../types";

export default function AllDecksScreen() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [deletingDeck, setDeletingDeck] = useState<Deck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  async function handleImportCSV(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    // You can prompt the user for deck metadata or hardcode for now
    formData.append("name", "Imported Deck");
    formData.append("description", "Imported from CSV");
    formData.append(
      "sourceLanguage",
      JSON.stringify({ name: "English", flag: "🇬🇧" })
    );
    formData.append(
      "targetLanguage",
      JSON.stringify({ name: "Polish", flag: "🇵🇱" })
    );

    try {
      await axios.post("/api/sets/import-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Deck imported successfully!");

      // Refresh decks and flashcards after import
      const [updatedDecks, updatedFlashcards] = await Promise.all([
        axios.get("/api/sets"),
        axios.get("/api/flashcards"),
      ]);

      setDecks(updatedDecks.data);
      setFlashcards(updatedFlashcards.data);
    } catch (error) {
      console.error("Error importing CSV:", error);
    }
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="sm:relative flex max-lg:flex-col max-lg:gap-3 justify-center items-center">
        <h1 className="uppercase text-4xl font-semibold">Decks</h1>
        {decks.length > 0 && (
          <div className="lg:absolute lg:right-0 flex max-sm:flex-col  gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-green-500 hover:bg-green-600 text-white transition-colors font-semibold px-4 py-2 rounded text-xl cursor-pointer flex items-center gap-2"
            >
              <MdFileUpload /> Import Deck (CSV)
            </button>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImportCSV}
            />
            <button
              className=" bg-green-500 hover:bg-green-600 text-white transition-colors font-semibold px-4 py-2 rounded text-xl cursor-pointer"
              onClick={() => setIsCreatingDeck(true)}
            >
              + Add Deck
            </button>
          </div>
        )}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-16 mt-4">
          {decks.map((deck) => (
            <DeckComponent
              deck={deck}
              flashcards={flashcards}
              setEditingDeck={setEditingDeck}
              setDeletingDeck={setDeletingDeck}
            />
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
      {deletingDeck && (
        <ModalConfirmDeletion
          deletingDeck={deletingDeck}
          setDeletingDeck={setDeletingDeck}
          updateDecks={setDecks}
        />
      )}
    </div>
  );
}
