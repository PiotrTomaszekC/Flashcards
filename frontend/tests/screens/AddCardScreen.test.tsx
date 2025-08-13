import userEvent from "@testing-library/user-event";
import AddCardScreen from "../../src/screens/AddCardScreen";
import { render, screen, waitFor } from "../testing-library-utils";
import { toast } from "react-toastify";
import * as AuthContext from "../../src/context/authContext";

globalThis.__TEST_USER_ID__ = "1";
const user = userEvent.setup();

describe("AddCardScreen - user with decks", () => {
  let wordInput: HTMLInputElement;
  let translationInput: HTMLInputElement;
  let selectDeck: HTMLSelectElement;
  let rememberCheckbox: HTMLInputElement;
  let submitButton: HTMLButtonElement;

  beforeEach(async () => {
    globalThis.__TEST_USER_ID__ = "1";
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      user: { _id: "1", email: "user@example.com", name: "Test User" },
      setUser: vi.fn(),
      logout: vi.fn(),
    });
    render(<AddCardScreen />);
    wordInput = await screen.findByLabelText("Word");
    translationInput = await screen.findByLabelText("Translation");
    selectDeck = await screen.findByLabelText("Choose Deck");
    rememberCheckbox = await screen.findByRole("checkbox", {
      name: "I already remember this word",
    });
    submitButton = await screen.findByRole("button");
  });

  afterEach(() => {
    delete globalThis.__TEST_USER_ID__;
  });

  test("renders elements", async () => {
    expect(wordInput).toBeInTheDocument();
    expect(translationInput).toBeInTheDocument();
    expect(selectDeck).toBeInTheDocument();
    expect(rememberCheckbox).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
  test("typing into form updates their values", async () => {
    await user.type(wordInput, "Dog");
    await user.type(translationInput, "Perro");
    await user.selectOptions(selectDeck, "deck1");
    await user.click(rememberCheckbox);
    expect(wordInput).toHaveValue("Dog");
    expect(translationInput).toHaveValue("Perro");
    expect(selectDeck).toHaveValue("deck1");
    expect(rememberCheckbox).toBeChecked();
  });
  test("submitting the form shows success toast and resets the form", async () => {
    await user.type(wordInput, "Dog");
    await user.type(translationInput, "Perro");
    await user.selectOptions(selectDeck, "deck1");
    await user.click(rememberCheckbox);
    await user.click(submitButton);
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Card added to deck!");
    });
    expect(wordInput).toHaveValue("");
    expect(translationInput).toHaveValue("");
    expect(selectDeck).toHaveValue("");
    expect(rememberCheckbox).not.toBeChecked();
  });
  test("shows error messages if fields are missing", async () => {
    // const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    // await user.click(submitButton);
    // expect(alertMock).toHaveBeenCalledWith(
    //   "Please fill in all required fields: Word, Translation, and Deck."
    // );
    // alertMock.mockRestore();
  });
});

describe("AddCardScreen - user without decks", () => {
  beforeEach(async () => {
    globalThis.__TEST_USER_ID__ = "2";
    render(<AddCardScreen />);
  });

  afterEach(() => {
    delete globalThis.__TEST_USER_ID__;
  });
  test("shows Link to go to /decks", async () => {
    const link = await screen.findByRole("link", { name: /My Decks/i });
    expect(link).toHaveAttribute("href", "/decks");
  });
  test("shows loader at the beginning", async () => {
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });
});
