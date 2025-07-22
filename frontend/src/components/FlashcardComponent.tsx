import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Flashcard } from "../types";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { IoCheckmarkSharp } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

interface FlashcardComponentProps {
  flashcards: Flashcard[];
  setFlashcards: Dispatch<SetStateAction<Flashcard[]>>;
}

export default function FlashcardComponent({
  flashcards,
  setFlashcards,
}: FlashcardComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  //temporarily hides the card and buttons during transitions so that they don't "appear" before they should
  const currentCard = flashcards[currentIndex];
  const [remember, setRemember] = useState(currentCard.remember);

  useEffect(() => {
    setRemember(currentCard.remember);
  }, [currentCard]);

  async function incrementDailyProgress() {
    await axios.post("/api/studyStats");
  }

  async function updateFlashcard() {
    try {
      await axios.put(`/api/flashcards/${currentCard._id}`, {
        remember,
      });
      setFlashcards((prev) =>
        prev.map((card) =>
          card._id === currentCard._id ? { ...card, remember } : card
        )
      );
    } catch (error) {
      console.error("Failed to update flashcard:", error);
    }
  }

  async function deleteFlashcard() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this flashcard?"
    );
    if (confirmed) {
      try {
        await axios.delete(`/api/flashcards/${currentCard._id}`);
        setFlashcards((prev) => {
          const updated = prev.filter((card) => card._id !== currentCard._id);

          if (currentIndex >= updated.length && updated.length > 0) {
            setCurrentIndex(updated.length - 1);
          }
          return updated;
        });
        toast.success("Flashcard deleted");
      } catch (error) {
        console.error("Failed to delete flashcard:", error);
      }
    }
  }

  function handleNext() {
    updateFlashcard();
    incrementDailyProgress();
    setIsFlipping(true);
    setShowTranslation(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
      setIsFlipping(false);
    }, 300); // Match this to your CSS transition duration
  }

  function handlePrevious() {
    updateFlashcard();
    incrementDailyProgress();
    setIsFlipping(true);
    setShowTranslation(false);
    setTimeout(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + flashcards.length) % flashcards.length
      );
      setIsFlipping(false);
    }, 300);
  }

  function handleCardClick() {
    setShowTranslation((prev) => !prev);
  }

  function handleBottomClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div className="flex flex-col items-center mt-4 w-[90%] sm:w-[60%] lg:w-1/4 min-h-[400px] py-5">
      {!isFlipping && (
        <div
          className="relative flex-1 w-full cursor-pointer"
          style={{ perspective: "1000px" }}
          onClick={handleCardClick}
        >
          <div
            className={`relative w-full h-full transition-transform duration-700 ease-in-out transform-gpu`}
            style={{
              transformStyle: "preserve-3d",
              transform: showTranslation ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Word */}
            <div
              className="absolute inset-0 w-full h-full bg-white rounded-md shadow-lg flex items-center justify-center"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <h2 className="text-4xl text-blue-600 font-bold">
                {currentCard.word}
              </h2>
            </div>

            {/* Translation */}
            <div
              className="absolute inset-0 w-full h-full bg-white rounded-md shadow-lg flex items-center justify-center"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <h2 className="text-4xl text-blue-600 font-bold">
                {currentCard.translation}
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      {!isFlipping && (
        <div
          onClick={handleBottomClick}
          className={`transition-opacity duration-300 mt-4 w-full flex justify-between items-center ${
            showTranslation ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={handlePrevious}
            className="p-2 hover:text-blue-600 transition-colors hover:cursor-pointer"
          >
            <GrCaretPrevious className="h-10 w-10" />
          </button>

          <div className="flex gap-4 items-center">
            <button
              className={`hover:text-blue-600 transition-colors hover:cursor-pointer ${
                remember && "text-blue-600"
              }`}
              onClick={() => setRemember((r) => !r)}
            >
              <IoCheckmarkSharp className="h-10 w-10" />
            </button>

            <button
              className="hover:text-blue-600 transition-colors hover:cursor-pointer"
              onClick={deleteFlashcard}
            >
              <FaTrash className="h-9 w-9" />
            </button>

            <div className="text-3xl font-semibold">
              {currentIndex + 1}/{flashcards.length}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="p-2 hover:text-blue-600 transition-colors hover:cursor-pointer"
          >
            <GrCaretNext className="h-10 w-10" />
          </button>
        </div>
      )}
    </div>
  );
}
