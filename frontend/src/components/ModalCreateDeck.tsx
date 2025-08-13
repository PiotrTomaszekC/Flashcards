import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import LANGUAGES from "../constants";
import { useCreateDeck } from "../hooks/useDecks";
import { deckSchema, type DeckFormData } from "../validation/deckSchemas";
import DeckForm from "./DeckForm";
import Loader from "./Loader";

interface ModalCreateDeckProps {
  setIsCreatingDeck: (value: boolean) => void;
  create: string;
  save: string;
}

export default function ModalCreateDeck({
  setIsCreatingDeck,
  create,
  save,
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
  const { mutate: createDeck, status } = useCreateDeck();
  const isLoading = status === "pending";

  function onSubmit(data: DeckFormData) {
    const sourceLanguage = LANGUAGES.find(
      (lang) => lang.name === data.sourceLng
    )!;
    const targetLanguage = LANGUAGES.find(
      (lang) => lang.name === data.targetLng
    )!;
    createDeck(
      {
        name: data.name,
        description: data.description,
        sourceLanguage,
        targetLanguage,
      },
      { onSuccess: () => setIsCreatingDeck(false) }
    );
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
          <h2 className="text-xl font-bold mb-4">{create}</h2>
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
