import { useRef, useState } from "react";
import { MdFileUpload } from "react-icons/md";
import DeckComponent from "../components/DeckComponent";
import Loader from "../components/Loader";
import ModalConfirmDeletion from "../components/ModalConfirmDeletion";
import ModalCreateDeck from "../components/ModalCreateDeck";
import ModalEditDeck from "../components/ModalEditDeck";
import { useDecks, useImportDeck } from "../hooks/useDecks";
import { useFlashcards } from "../hooks/useFlashcards";
import type { Deck } from "../types";
import { useTranslation } from "react-i18next";

export default function AllDecksScreen() {
  const { data: decks = [], isLoading: loadingDecks } = useDecks();
  const { data: flashcards = [], isLoading: loadingFlashcards } =
    useFlashcards();
  const { mutate: importDeck } = useImportDeck();
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [deletingDeck, setDeletingDeck] = useState<Deck | null>(null);
  const isLoading = loadingDecks || loadingFlashcards;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();

  function handleImportCSV(event: React.ChangeEvent<HTMLInputElement>) {
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
    importDeck(formData);
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
        <h1 className="uppercase text-4xl font-semibold">{t("myDecks")}</h1>
        {decks.length > 0 && (
          <div className="lg:absolute lg:right-0 flex max-sm:flex-col  gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-green-500 hover:bg-green-600 text-white transition-colors font-semibold px-4 py-2 rounded text-xl cursor-pointer flex items-center gap-2"
            >
              <MdFileUpload /> {t("importDeck")}
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
              {t("addDeck")}
            </button>
          </div>
        )}
      </div>

      {!decks.length ? (
        <div className="items-center text-lg mt-20 flex flex-col">
          <p>{t("noDecks")}</p>
          <button
            onClick={() => setIsCreatingDeck(true)}
            className="text-white bg-blue-500 hover:bg-blue-600 transition-colors px-3 py-2 rounded-md font-semibold mt-2 cursor-pointer text-2xl"
          >
            {t("createDeck")}
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
              learn={t("learn")}
            />
          ))}
        </div>
      )}

      {editingDeck && (
        <ModalEditDeck
          editingDeck={editingDeck}
          setEditingDeck={setEditingDeck}
          editDeckS={t("editDeck")}
          save={t("save")}
        />
      )}
      {isCreatingDeck && (
        <ModalCreateDeck
          setIsCreatingDeck={setIsCreatingDeck}
          create={t("createDeck")}
          save={t("save")}
        />
      )}
      {deletingDeck && (
        <ModalConfirmDeletion
          deletingDeck={deletingDeck}
          setDeletingDeck={setDeletingDeck}
          confirmD={t("confirmD")}
          deleteD={t("deleteD")}
          cancel={t("cancel")}
        />
      )}
    </div>
  );
}
