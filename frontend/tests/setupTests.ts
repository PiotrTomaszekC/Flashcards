import "@testing-library/jest-dom";
import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./mocks/server";
import type { TFunction } from "i18next";

//Mock useNavigate globally
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => vi.fn(), // You can override this in individual tests if needed
  };
});

// Mock toast globally
vi.mock("react-toastify", async () => {
  const actual = await vi.importActual<typeof import("react-toastify")>(
    "react-toastify"
  );
  return {
    ...actual,
    toast: {
      ...actual.toast,
      error: vi.fn(),
      success: vi.fn(),
    },
  };
});

// Define the translation object type
type Translations = Record<string, string | Record<string, string>>;

const translations: Translations = {
  home: "Home",
  myDecks: "My Decks",
  addCard: "Add Card",
  learn: "Learn",
  login: "Log in",
  logout: "Log out",
  confirmLogout: "Are you sure you want to log out?",
  cancel: "Cancel",
  yourStats: "Your Stats",
  sets: "Sets",
  languages: "Languages",
  cards: "Cards",
  remembered: "Remembered",
  completion: "Completion",
  repetitions: "Repetitions",
  recentlyStudied: "Recently studied decks",
  noRecentDecks: "You haven't studied any decks yet.",
  goToDecks: "Go to Decks",
  studyGoal: "Study Goal",
  dailyGoal: "Daily Goal (cards reviewed per day):",
  repetitionsToday: "Repetitions Today",
  currentStreak: "Current Streak:",
  day: "Days",
  importDeck: "Import Deck (CSV)",
  addDeck: "+ Add Deck",
  noDecks: "You have no decks yet.",
  createDeck: "Create a Deck",
  deckName: "Deck Name",
  description: "Description",
  editDeck: "Edit Deck",
  save: "Save",
  confirmD:
    "Are you sure you want to delete this deck with associated flashcards?",
  deleteD: "Delete deck",
  word: "Word",
  translation: "Translation",
  chooseDeck: "Choose Deck",
  alreadyRemember: "I already remember this word",
  chooseLng: "Choose the language pair you would like to learn:",
  addDeckCards: "Add a deck and some cards to start learning.",
  noFlashcards: "You have no flashcards yet.",
  noFinD: "No flashcards in this set yet.",
  confirmFDelete: "Are you sure you want to delete this flashcard?",
  updateProfile: "Update User Profile",
  name: "Name",
  newPassword: "New Password",
  confirmNewPassword: "Confirm New Password",
  updateProfileB: "Update profile",
  password: "Password",
  noAccount: "Don't have an account yet?",
  registerHere: "Register here →",
  registerUser: "Register new user",
  confirmPassword: "Confirm Password",
  register: "Register",
  alreadyRegistered: "Already registered user?",
  languagesO: {
    English: "English",
    Polish: "Polish",
    Spanish: "Spanish",
    French: "French",
    German: "German",
  },
  errors: {
    usernameTooShort: "Username must have at least 4 letters",
    required: "This field is required",
    invalidEmail: "Please enter a valid email address",
    passwordTooShort: "Password must have at least 8 characters",
    passwordUppercase: "Password must contain at least one uppercase letter",
    passwordNumber: "Password must contain at least one number",
    passwordComplexity:
      "Password must have at least 8 characters, contain an uppercase letter and a number",
    passwordsDontMatch: "Passwords do not match",
    deckNameRequired: "Deck name is required",
    deckNameNotSpaces: "Deck name cannot be just spaces",
    srcLngRequired: "Source language is required",
    trgLngRequired: "Target language is required",
    wordRequired: "Word is required",
    wordNotSpaces: "Word cannot be just spaces",
    translationRequired: "Translation is required",
    translationNotSpaces: "Translation cannot be just spaces",
    deckRequired: "Deck is required",
  },
  toasts: {
    loggedOut: "User logged out",
    deckEdited: "Deck edited successfully",
    deckCreated: "Deck created successfully",
    deckFlashcardsDeleted: "Deck and flashcards deleted",
    deckImported: "Deck imported successfully",
    deckExported: "Deck exported successfully!",
    cardAdded: "Card added to deck!",
    flashcardDeleted: "Flashcard deleted",
    login: "Login successfull!",
    invalidEmail: "Invalid email or password",
    registered: "User successfully registered",
    profileUpdated: "User profile updated!",
  },
};

vi.mock("react-i18next", async () => {
  return {
    useTranslation: (): {
      t: TFunction;
      i18n: { language: string; changeLanguage: () => void };
    } => ({
      t: (key: string): string => {
        const keys = key.split(".");
        let value: unknown = translations;
        for (const k of keys) {
          if (typeof value === "object" && value !== null && k in value) {
            value = (value as Record<string, unknown>)[k];
          } else {
            return key;
          }
        }
        return typeof value === "string" ? value : key;
      },
      i18n: {
        language: "en",
        changeLanguage: vi.fn(),
      },
    }),
  };
});

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
