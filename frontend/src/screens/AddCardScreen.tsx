import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import type { Deck } from "../types";
import { Link, useLocation } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

export default function AddCardScreen() {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [decks, setDecks] = useState<Deck[]>([]);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirectedFrom = sp.get("deck") || "";
  const [category, setCategory] = useState(redirectedFrom);

  useEffect(function () {
    const fetchDecks = async function () {
      try {
        const { data } = await axios.get("/api/sets");
        setDecks(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDecks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!word.trim() || !translation.trim() || !category.trim()) {
      alert("Please fill in all required fields: Word, Translation, and Deck.");
      return;
    }
    try {
      await axios.post("/api/flashcards", {
        set: category,
        word,
        translation,
        remember,
      });
      toast.success("Card added to deck!");

      setWord("");
      setTranslation("");
      setCategory("");
      setRemember(false);
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
    <div className="flex flex-col gap-4 items-center">
      <h1 className="uppercase text-4xl font-semibold">Add new card</h1>
      {decks.length === 0 ? (
        <div className="items-center text-lg mt-20 flex flex-col">
          <p className="max-sm:text-center">
            You don't have any decks yet. Start by creating one.
          </p>
          <Link
            to="/decks"
            className="text-white bg-blue-500 hover:bg-blue-600 transition-colors px-3 py-2 rounded-md font-semibold mt-2 text-2xl"
          >
            Go to Decks
          </Link>
        </div>
      ) : (
        <form
          className="w-full sm:w-[80%] lg:w-1/3 flex flex-col items-center justify-center bg-white rounded-md p-6 text-2xl gap-10 shadow-md"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-center gap-3 w-full md:w-2/3">
            <label htmlFor="polish">Word</label>
            <input
              id="polish"
              type="text"
              className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            ></input>
          </div>

          <div className="flex flex-col items-center gap-3 w-full md:w-2/3">
            <label htmlFor="english">Translation</label>
            <input
              id="english"
              type="text"
              className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
            ></input>
          </div>

          <div className="flex flex-col items-center gap-3 w-full md:w-2/3">
            <label htmlFor="category">Choose Deck</label>
            <select
              id="category"
              className="border-blue-400 max-lg:appearance-none  border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="">Choose a deck...</option>
              {decks.map((deck) => (
                <option key={deck._id} value={deck._id}>
                  {deck.name} ({deck.sourceLanguage.name}→
                  {deck.targetLanguage.name})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 lg:w-2/3">
            <input
              type="checkbox"
              id="remember"
              className="w-5 h-5"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
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
      )}
    </div>
  );
}
