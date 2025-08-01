import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "../testing-library-utils";
import LearnSreen from "../../src/screens/LearnScreen";

globalThis.__TEST_USER_ID__ = "1";
const user = userEvent.setup();

describe("LearnScreen - user with decks", () => {
  let selectDeck: HTMLSelectElement;
  let learnButton: HTMLButtonElement;

  beforeEach(async () => {
    globalThis.__TEST_USER_ID__ = "1";
    render(<LearnSreen />);
    selectDeck = await screen.findByLabelText(
      "Choose the language pair you would like to learn:"
    );
    learnButton = await screen.findByRole("button", { name: "Learn" });
  });

  afterEach(() => {
    delete globalThis.__TEST_USER_ID__;
  });

  test("renders select element and learn button", async () => {
    expect(selectDeck).toBeInTheDocument();
    expect(learnButton).toBeInTheDocument();
    await user.selectOptions(selectDeck, "English-Spanish");
    expect(selectDeck).toHaveValue("English-Spanish");
    await user.selectOptions(selectDeck, "English-French");
    expect(selectDeck).toHaveValue("English-French");
  });
});

describe("LearnScreen - user without decks", () => {
  beforeEach(async () => {
    globalThis.__TEST_USER_ID__ = "2";
    render(<LearnSreen />);
  });

  afterEach(() => {
    delete globalThis.__TEST_USER_ID__;
  });

  test("renders link to add decks", async () => {
    const addDeckLink = await screen.findByRole("link", { name: "Add a Deck" });
    expect(addDeckLink).toHaveAttribute("href", "/decks");
  });
  test("renders loader on component render", async () => {
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });
});
