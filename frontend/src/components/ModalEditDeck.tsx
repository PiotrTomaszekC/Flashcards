import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import LANGUAGES from "../constants";
import { useEditDeck } from "../hooks/useDecks";
import type { Deck } from "../types";
import { deckSchema, type DeckFormData } from "../validation/deckSchemas";
import DeckForm from "./DeckForm";
import Loader from "./Loader";

interface ModalEditDeckProps {
  editingDeck: Deck;
  setEditingDeck: (deck: Deck | null) => void;
  editDeckS: string;
  save: string;
}

export default function ModalEditDeck({
  setEditingDeck,
  editingDeck,
  editDeckS,
  save,
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
  const { mutate: editDeck, status } = useEditDeck();
  const isLoading = status === "pending";

  function onSubmit(data: DeckFormData) {
    const sourceLanguage = LANGUAGES.find(
      (lang) => lang.name === data.sourceLng
    )!;
    const targetLanguage = LANGUAGES.find(
      (lang) => lang.name === data.targetLng
    )!;
    const passedInData = {
      deckId: editingDeck._id,
      name: data.name,
      description: data.description,
      sourceLanguage,
      targetLanguage,
    };
    editDeck(passedInData, { onSuccess: () => setEditingDeck(null) });
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
          <h2 className="text-xl font-bold mb-4">{editDeckS}</h2>
          <DeckForm
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            errors={errors}
            onClose={onClose}
            buttonLabel={save}
          />
        </div>
      )}
    </div>
  );
}
