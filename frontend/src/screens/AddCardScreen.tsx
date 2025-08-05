import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AddCardForm from "../components/AddCardForm";
import Loader from "../components/Loader";
import type { Deck } from "../types";

export default function AddCardScreen() {
  const [loading, setLoading] = useState(true);
  const [decks, setDecks] = useState<Deck[]>([]);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirectedFrom = sp.get("deck") || "";

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
        <AddCardForm decks={decks} defaultDeckId={redirectedFrom} />
      )}
    </div>
  );
}
