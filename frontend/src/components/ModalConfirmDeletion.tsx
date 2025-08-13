import { useDeleteDeck } from "../hooks/useDecks";
import type { Deck } from "../types";
import Loader from "./Loader";

interface ModalConfirmProps {
  deletingDeck: Deck;
  setDeletingDeck: (deck: Deck | null) => void;
  confirmD: string;
  deleteD: string;
  cancel: string;
}

export default function ModalConfirmDeletion({
  deletingDeck,
  setDeletingDeck,
  confirmD,
  deleteD,
  cancel,
}: ModalConfirmProps) {
  const { mutate: deleteDeck, status } = useDeleteDeck();
  const isLoading = status === "pending";

  function handleDelete() {
    deleteDeck(deletingDeck._id, { onSuccess: () => setDeletingDeck(null) });
  }

  return (
    <div
      className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50"
      onClick={() => setDeletingDeck(null)}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className="bg-white p-6 rounded shadow-lg w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold mb-4 text-center">{confirmD}</h3>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setDeletingDeck(null)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors cursor-pointer"
            >
              {cancel}
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
              onClick={handleDelete}
            >
              {deleteD}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
