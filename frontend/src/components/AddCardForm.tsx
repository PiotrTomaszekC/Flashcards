import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import type { Deck } from "../types";
import { cardSchema, type CardFormData } from "../validation/cardSchemas";

interface AddCardFormProps {
  decks: Deck[];
  defaultDeckId?: string;
}

export default function AddCardForm({
  decks,
  defaultDeckId,
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

  async function onSubmit(data: CardFormData) {
    try {
      await axios.post("/api/flashcards", {
        set: data.deckId,
        word: data.word,
        translation: data.translation,
        remember: data.remember,
      });
      toast.success("Card added to deck!");
      reset();
    } catch (error: unknown) {
      let errorMessage = "Something went wrong. Please try again.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      //Axios error is the 400 response coming from backend wrapped in AxiosError
      //error instanceof Error is the built-in JS error class
    }
  }
  return (
    <form
      className="w-full sm:w-[80%] lg:w-1/3 flex flex-col items-center justify-center bg-white rounded-md p-6 text-2xl gap-10 shadow-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center gap-3 w-full md:w-2/3">
        <label htmlFor="word">Word</label>
        <input
          id="word"
          type="text"
          className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
          {...register("word")}
        />
        {errors?.word?.message && (
          <p className="text-red-600 text-base">{errors.word.message}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 w-full md:w-2/3">
        <label htmlFor="translation">Translation</label>
        <input
          id="translation"
          type="text"
          className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
          {...register("translation")}
        />
        {errors?.translation?.message && (
          <p className="text-red-600 text-base">{errors.translation.message}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 w-full md:w-2/3">
        <label htmlFor="deckId">Choose Deck</label>
        <select
          id="deckId"
          className="border-blue-400 max-lg:appearance-none  border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
          {...register("deckId")}
        >
          <option value="">Choose a deck...</option>
          {decks.map((deck) => (
            <option key={deck._id} value={deck._id}>
              {deck.name} ({deck.sourceLanguage.name}→{deck.targetLanguage.name}
              )
            </option>
          ))}
        </select>
        {errors?.deckId?.message && (
          <p className="text-red-600 text-base">{errors.deckId.message}</p>
        )}
      </div>

      <div className="flex items-center gap-3 lg:w-2/3">
        <input
          type="checkbox"
          id="remember"
          className="w-5 h-5"
          {...register("remember")}
        />
        <label htmlFor="remember">I already remember this word</label>
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
