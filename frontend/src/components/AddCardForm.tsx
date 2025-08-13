import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { useCreateFlashcard } from "../hooks/useFlashcards";
import type { Deck } from "../types";
import { cardSchema, type CardFormData } from "../validation/cardSchemas";
import Loader from "./Loader";
import { useTranslation } from "react-i18next";

interface AddCardFormProps {
  decks: Deck[];
  defaultDeckId?: string;
  word: string;
  translation: string;
  chooseDeck: string;
  alreadyRemember: string;
}

export default function AddCardForm({
  decks,
  defaultDeckId,
  word,
  translation,
  chooseDeck,
  alreadyRemember,
}: AddCardFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CardFormData>({
    defaultValues: {
      deckId: defaultDeckId || "",
    },
    resolver: zodResolver(cardSchema),
  });
  const { mutate: createFlashcard, status } = useCreateFlashcard();
  const isLoading = status === "pending";
  const { t } = useTranslation();

  function onSubmit(data: CardFormData) {
    createFlashcard(data, {
      onSuccess: () => reset(), // Only reset here, toast is handled in the hook
    });
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );

  return (
    <form
      className="w-full sm:w-[80%] lg:w-1/3 flex flex-col items-center justify-center bg-white rounded-md p-6 text-2xl gap-10 shadow-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center gap-3 w-full md:w-2/3">
        <label htmlFor="word">{word}</label>
        <input
          id="word"
          type="text"
          className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
          {...register("word")}
        />
        {errors?.word?.message && (
          <p className="text-red-600 text-base">{t(errors.word.message)}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 w-full md:w-2/3">
        <label htmlFor="translation">{translation}</label>
        <input
          id="translation"
          type="text"
          className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
          {...register("translation")}
        />
        {errors?.translation?.message && (
          <p className="text-red-600 text-base">
            {t(errors.translation.message)}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 w-full md:w-2/3">
        <label htmlFor="deckId">{chooseDeck}</label>
        <select
          id="deckId"
          className="border-blue-400 max-lg:appearance-none  border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
          {...register("deckId")}
        >
          <option value="">{chooseDeck}...</option>
          {decks.map((deck) => (
            <option key={deck._id} value={deck._id}>
              {deck.name} ({t(`languagesO.${deck.sourceLanguage.name}`)}→
              {t(`languagesO.${deck.targetLanguage.name}`)})
            </option>
          ))}
        </select>
        {errors?.deckId?.message && (
          <p className="text-red-600 text-base">{t(errors.deckId.message)}</p>
        )}
      </div>

      <div className="flex items-center gap-3 lg:w-2/3">
        <input
          type="checkbox"
          id="remember"
          className="w-5 h-5"
          {...register("remember")}
        />
        <label htmlFor="remember">{alreadyRemember}</label>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center w-12 h-12 leading-none cursor-pointer"
      >
        <FaPlus />
      </button>
    </form>
  );
}
