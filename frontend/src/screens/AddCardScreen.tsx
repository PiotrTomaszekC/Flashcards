import { useState } from "react";
import type { Flashcard } from "../types";

export default function AddCardScreen() {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [category, setCategory] = useState("");
  const [remember, setRemember] = useState(false);
  // const [flashcards, setFlashcards] = useState<Flashcard[]>(
  //   flashcardsData as Flashcard[]
  // );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!word.trim() || !translation.trim() || !category.trim()) {
      alert(
        "Please fill in all required fields: Word, Translation, and Category."
      );
      return;
    }

    // const newCard: Flashcard = {
    //   id: flashcards.length + 1,
    //   word,
    //   translation,
    //   category: category as Flashcard["category"],
    //   remember,
    // };
    // setFlashcards([...flashcards, newCard]);

    setWord("");
    setTranslation("");
    setCategory("");
    setRemember(false);
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="uppercase text-4xl font-semibold">Add new card</h1>
      <form
        className="w-1/3 flex flex-col items-center justify-center bg-white rounded-md p-6 text-2xl gap-10 shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center gap-3 w-2/3">
          <label htmlFor="polish">Word</label>
          <input
            id="polish"
            type="text"
            className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          ></input>
        </div>

        <div className="flex flex-col items-center gap-3 w-2/3">
          <label htmlFor="english">Translation</label>
          <input
            id="english"
            type="text"
            className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
          ></input>
        </div>

        <div className="flex flex-col items-center gap-3 w-2/3">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <option value="">Choose a category...</option>
            <option value="Animals">Animals</option>
            <option value="Transport">Transport</option>
            <option value="House">House</option>
            <option value="Colors">Colors</option>
            <option value="Numbers">Numbers</option>
          </select>
        </div>

        <div className="flex items-center gap-3 w-2/3">
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
          className="bg-blue-500 text-white rounded-md text-3xl hover:bg-blue-600 flex items-center justify-center w-12 h-12 leading-none"
        >
          +
        </button>
      </form>
    </div>
  );
}
