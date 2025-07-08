import { useEffect, useState } from "react";
import type { Flashcard } from "../types";
import axios from "axios";

export default function DecksScreen() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  useEffect(function () {
    const fetchFlashcards = async function () {
      const { data } = await axios.get("/api/flashcards");
      setFlashcards(data);
    };

    fetchFlashcards();
  });

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="uppercase text-4xl font-semibold">All cards</h1>
      <div>
        {flashcards.map((card) => (
          <div key={card.id}>
            <h3>{card.word}</h3>
            <h3>{card.translation}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
