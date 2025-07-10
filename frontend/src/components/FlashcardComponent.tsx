import { useState } from "react";
import type { Flashcard } from "../types";
import { GrCaretNext } from "react-icons/gr";
import { GrCaretPrevious } from "react-icons/gr";

interface FlashcardComponentProps {
  flashcards: Flashcard[];
}

export default function FlashcardComponent({
  flashcards,
}: FlashcardComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);

  const currentCard = flashcards[currentIndex];

  function handleNext() {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setShowTranslation(false);
  }

  function handlePrevious() {
    setCurrentIndex(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
    setShowTranslation(false);
  }

  function handleCardClick() {
    setShowTranslation(true);
  }

  function handleBottomClick(e: React.MouseEvent) {
    e.stopPropagation(); // Prevents triggering the card click
  }

  return (
    <div
      className="flex flex-col items-center mt-4 bg-white w-1/4 h-1/2 py-5 rounded-md"
      onClick={handleCardClick}
    >
      <div className="flex-1 flex items-center justify-center w-full">
        {showTranslation ? (
          <h2 className="text-4xl text-blue-600 font-bold">
            {currentCard.translation}
          </h2>
        ) : (
          <h2 className="text-4xl text-blue-600 font-bold">
            {currentCard.word}
          </h2>
        )}
      </div>

      <div
        onClick={handleBottomClick}
        className={`transition-opacity duration-300 ${
          showTranslation ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={handlePrevious}
          className="bg-transparent p-2 rounded hover:text-blue-600 transition-colors hover:cursor-pointer"
        >
          <GrCaretPrevious className="h-10 w-10" />
        </button>
        <button
          onClick={handleNext}
          className="bg-transparent p-2 rounded hover:text-blue-600 transition-colors hover:cursor-pointer"
        >
          <GrCaretNext className="h-10 w-10" />
        </button>
      </div>
    </div>
  );
}
