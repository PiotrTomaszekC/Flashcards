import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import LANGUAGES from "../constants";
import type { Deck } from "../types";
import DeckForm from "./DeckForm";
import Loader from "./Loader";
import { deckSchema, type DeckFormData } from "../validation/deckSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

interface ModalCreateDeckProps {
  setIsCreatingDeck: (value: boolean) => void;
  updateDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
}

export default function ModalCreateDeck({
  setIsCreatingDeck,
  updateDecks,
}: ModalCreateDeckProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeckFormData>({
    defaultValues: {
      sourceLng: LANGUAGES[0].name,
      targetLng: LANGUAGES[1].name,
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
    const { data: newDeck } = await axios.post("/api/sets", {
      name: data.name,
      description: data.description,
      sourceLanguage,
      targetLanguage,
    });
    setIsLoading(false);
    updateDecks((prevDecks) => [...prevDecks, newDeck]);
    setIsCreatingDeck(false);
    toast.success("Deck created successfully");
  }

  function onClose() {
    setIsCreatingDeck(false);
  }

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
          <DeckForm
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            errors={errors}
            onClose={onClose}
            buttonLabel="Create"
          />
        </div>
      )}
    </div>
  );
}
