import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "../testing-library-utils";
import AllDecksScreen from "../../src/screens/AllDecksScreen";
import { toast } from "react-toastify";
import * as AuthContext from "../../src/context/authContext";

globalThis.__TEST_USER_ID__ = "1";
const user = userEvent.setup();

describe("AllDecksScreen - user with decks", () => {
  beforeEach(() => {
    globalThis.__TEST_USER_ID__ = "1";
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      user: { _id: "1", email: "user@example.com", name: "Test User" },
      setUser: vi.fn(),
      logout: vi.fn(),
    });

    render(<AllDecksScreen />);
  });

  afterEach(() => {
    delete globalThis.__TEST_USER_ID__;
  });

  test("renders buttons to import, add deck and Deck div", async () => {
    const addDeckButton = await screen.findByRole("button", {
      name: "+ Add Deck",
    });
    const importDeckButton = await screen.findByRole("button", {
      name: /import deck/i,
    });
    const deckHeading = await screen.findByRole("heading", {
      name: "Spanish Basics",
    });
    const deckDev = deckHeading.closest("div");
    expect(addDeckButton).toBeInTheDocument();
    expect(importDeckButton).toBeInTheDocument();
    expect(deckDev).toBeInTheDocument();
  });
  test("clicking + and Learn links on Deck redirects", async () => {
    const addCardLink = await screen.findByTestId("add-card-link-deck1");
    const learnDeckLink = await screen.findByTestId("decks-link-deck1");
    expect(addCardLink).toHaveAttribute("href", "/addCard?deck=deck1");
    expect(learnDeckLink).toHaveAttribute("href", "/decks/deck1");
  });
  test("clicking delete button renders modal", async () => {
    const deleteButton = await screen.findByTestId("delete-deck-deck1");
    await user.click(deleteButton);
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    const deleteDeckButton = screen.getByRole("button", {
      name: "Delete deck",
    });
    expect(cancelButton).toBeInTheDocument();
    expect(deleteDeckButton).toBeInTheDocument();
  });
  test("deleting a deck shows loader, success toast and closes modal", async () => {
    const deleteButton = await screen.findByTestId("delete-deck-deck1");
    await user.click(deleteButton);
    const deleteDeckButton = screen.getByRole("button", {
      name: "Delete deck",
    });
    await user.click(deleteDeckButton);
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Deck and flashcards deleted");
    });
    expect(deleteDeckButton).not.toBeInTheDocument();
  });
  test("clicking edit button renders modal with prefilled values", async () => {
    const editButton = await screen.findByTestId("edit-deck-deck1");
    await user.click(editButton);
    const nameInput = screen.getByPlaceholderText("Deck Name");
    const selectSourceLng = screen.getByTestId("source-language");
    const selectTargetLng = screen.getByTestId("target-language");
    const description = screen.getByPlaceholderText("Description");
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    const saveButton = screen.getByRole("button", { name: "Save" });
    expect(nameInput).toHaveValue("Spanish Basics");
    expect(selectSourceLng).toHaveValue("English");
    expect(selectTargetLng).toHaveValue("Spanish");
    expect(description).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });
  test("submitting modal shows loader and success toast", async () => {
    const editButton = await screen.findByTestId("edit-deck-deck1");
    await user.click(editButton);
    const nameInput = screen.getByPlaceholderText("Deck Name");
    const selectSourceLng = screen.getByTestId("source-language");
    const selectTargetLng = screen.getByTestId("target-language");
    const description = screen.getByPlaceholderText("Description");
    const saveButton = screen.getByRole("button", { name: "Save" });
    await user.clear(nameInput);
    await user.type(nameInput, "Animals");
    await user.selectOptions(selectSourceLng, "English");
    await user.selectOptions(selectTargetLng, "Polish");
    await user.type(description, "Animal Vocabulary");
    await user.click(saveButton);
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Deck edited successfully");
    });
  });
});

describe("AllDecksScreen - user without decks", () => {
  beforeEach(() => {
    globalThis.__TEST_USER_ID__ = "2";

    render(<AllDecksScreen />);
  });

  afterEach(() => {
    delete globalThis.__TEST_USER_ID__;
  });

  test("renders button to create deck", async () => {
    const button = await screen.findByRole("button", { name: "Create a Deck" });
    expect(button).toBeInTheDocument();
  });
  test("clicking button renders modal", async () => {
    const button = await screen.findByRole("button", { name: "Create a Deck" });
    await user.click(button);
    const nameInput = screen.getByPlaceholderText("Deck Name");
    const selectSourceLng = screen.getByTestId("source-language");
    const selectTargetLng = screen.getByTestId("target-language");
    const description = screen.getByPlaceholderText("Description");
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    const submitButton = screen.getByRole("button", { name: "Create a Deck" });
    expect(nameInput).toBeInTheDocument();
    expect(selectSourceLng).toBeInTheDocument();
    expect(selectTargetLng).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
  test("clicking cancel button closes modal", async () => {
    const button = await screen.findByRole("button", { name: "Create a Deck" });
    await user.click(button);
    const nameInput = screen.getByPlaceholderText("Deck Name");
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);
    expect(nameInput).not.toBeInTheDocument();
  });
  test("submitting modal shows loader and success toast", async () => {
    const button = await screen.findByRole("button", { name: "Create a Deck" });
    await user.click(button);
    const nameInput = screen.getByPlaceholderText("Deck Name");
    const selectSourceLng = screen.getByTestId("source-language");
    const selectTargetLng = screen.getByTestId("target-language");
    const description = screen.getByPlaceholderText("Description");
    const submitButton = screen.getByRole("button", { name: "Save" });
    await user.type(nameInput, "Animals");
    await user.selectOptions(selectSourceLng, "English");
    await user.selectOptions(selectTargetLng, "Polish");
    await user.type(description, "Animal Vocabulary");
    await user.click(submitButton);
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Deck created successfully");
    });
  });
  test("renders loader on component render", async () => {
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });
});
