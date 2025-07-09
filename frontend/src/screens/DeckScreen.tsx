import { useParams } from "react-router-dom";

export default function DeckScreen() {
  const { id } = useParams();

  return <div>Deck {id}</div>;
}
