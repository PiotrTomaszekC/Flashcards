import axios from "axios";
import { useState } from "react";
import type { Deck } from "../types";
import Loader from "./Loader";
import LANGUAGES from "../constants";
import { toast } from "react-toastify";
import DeckForm from "./DeckForm";
import { useForm } from "react-hook-form";
import { deckSchema, type DeckFormData } from "../validation/deckSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeckFormData>({
    defaultValues: {
      name: editingDeck.name,
      sourceLng: editingDeck.sourceLanguage.name,
      targetLng: editingDeck.targetLanguage.name,
      description: editingDeck.description,
    },
    resolver: zodResolver(deckSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: DeckFormData) {
    setIsLoading(true);
    const sourceLanguage = LANGUAGES.find(
      (lang) => lang.name === data.sourceLng
    )!;
    const targetLanguage = LANGUAGES.find(
      (lang) => lang.name === data.targetLng
    )!;
    const { data: updatedDeck } = await axios.put(
      `/api/sets/${editingDeck._id}`,
      {
        name: data.name,
        description: data.description,
        sourceLanguage,
        targetLanguage,
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
  }

  function onClose() {
    setEditingDeck(null);
  }

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
          <DeckForm
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            errors={errors}
            onClose={onClose}
            buttonLabel="Save"
          />
        </div>
      )}
    </div>
  );
}
