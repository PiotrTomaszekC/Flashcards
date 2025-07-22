import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaEdit, FaFile, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { IoMdDownload } from "react-icons/io";
import { MdFileUpload } from "react-icons/md";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import ModalConfirmDeletion from "../components/ModalConfirmDeletion";
import ModalCreateDeck from "../components/ModalCreateDeck";
import ModalEditDeck from "../components/ModalEditDeck";
import type { Deck, Flashcard } from "../types";
import { toast } from "react-toastify";

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

  async function saveToRecentDecks(deckId: string) {
    await axios.put("/api/users", { deckId });
  }

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
      <div className="flex items-center justify-center h-screen">
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
            <div
              key={deck._id}
              className="bg-blue-100 rounded-md p-4 transform transition-transform duration-300 hover:scale-105 flex flex-col justify-between min-h-[200px]"
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
                  // onClick={() => handleDelete(deck._id)}
                  onClick={() => setDeletingDeck(deck)}
                >
                  <FaTrash />
                </button>
                <Link
                  to={`/decks/${deck._id}`}
                  onClick={() => saveToRecentDecks(deck._id)}
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
