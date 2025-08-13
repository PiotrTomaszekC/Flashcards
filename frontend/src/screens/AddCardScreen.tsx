import { Link, useLocation } from "react-router-dom";
import AddCardForm from "../components/AddCardForm";
import Loader from "../components/Loader";
import { useDecks } from "../hooks/useDecks";
import { useTranslation } from "react-i18next";

export default function AddCardScreen() {
  const { data: decks = [], isLoading: decksLoading } = useDecks();
  const { search } = useLocation();
  const { t } = useTranslation();
  const sp = new URLSearchParams(search);
  const redirectedFrom = sp.get("deck") || "";

  if (decksLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="uppercase text-4xl font-semibold">{t("addCard")}</h1>
      {decks.length === 0 ? (
        <div className="items-center text-lg mt-20 flex flex-col">
          <p className="max-sm:text-center">{t("noDecks")}</p>
          <Link
            to="/decks"
            className="text-white bg-blue-500 hover:bg-blue-600 transition-colors px-3 py-2 rounded-md font-semibold mt-2 text-2xl"
          >
            {t("myDecks")}
          </Link>
        </div>
      ) : (
        <AddCardForm
          decks={decks}
          defaultDeckId={redirectedFrom}
          word={t("word")}
          translation={t("translation")}
          chooseDeck={t("chooseDeck")}
          alreadyRemember={t("alreadyRemember")}
        />
      )}
    </div>
  );
}
