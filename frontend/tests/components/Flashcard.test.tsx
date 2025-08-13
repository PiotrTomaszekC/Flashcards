import userEvent from "@testing-library/user-event";
import FlashcardComponent from "../../src/components/FlashcardComponent";
import { render, screen } from "../testing-library-utils";

const flashcards = [
  {
    _id: "card1",
    set: "set1",
    word: "Dog",
    translation: "Perro",
    remember: true,
    repetitions: 3,
    rememberedCount: 2,
  },
  {
    _id: "card2",
    set: "set1",
    word: "Cat",
    translation: "Gato",
    remember: false,
    repetitions: 1,
    rememberedCount: 2,
  },
];

render(<FlashcardComponent flashcards={flashcards} />);

const user = userEvent.setup();
const word = screen.getByRole("heading", { name: "Dog" });
const translation = screen.getByRole("heading", { name: "Perro" });
const previousButton = screen.getByTestId("previous-card-button");
const nextButton = screen.getByTestId("next-card-button");
const rememberButton = screen.getByTestId("remember-button");
const deleteButton = screen.getByTestId("delete-button");

describe("Flashcard component", () => {
  test("renders elements", () => {
    expect(word).toBeInTheDocument();
    expect(translation).toBeInTheDocument();
    //cant check translation with not.toBeInTheDocument() nor not.toBeVisible() because its in the DOM and visible in terms of CSS properties
    expect(previousButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    expect(rememberButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  // test("changes the displayed card with buttons", async () => {
  //   await user.click(word);
  //   const confirmMock = vi.spyOn(window, "confirm").mockReturnValue(true);
  //   await user.click(deleteButton);
  //   expect(confirmMock).toHaveBeenCalledWith(
  //     "Are you sure you want to delete this flashcard?"
  //   );
  //   confirmMock.mockRestore();
  // });
});
