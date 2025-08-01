import { describe } from "vitest";
import * as AuthContext from "../../src/context/authContext";
import HomeScreen from "../../src/screens/HomeScreen";
import { render, screen, waitFor } from "../testing-library-utils";
import userEvent from "@testing-library/user-event";

globalThis.__TEST_USER_ID__ = "1";
const user = userEvent.setup();

describe("HomeScreen - user with decks", () => {
  beforeEach(() => {
    globalThis.__TEST_USER_ID__ = "1";

    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      user: { _id: "1", email: "user@example.com", name: "Test User" },
      setUser: vi.fn(),
      logout: vi.fn(),
    });

    render(<HomeScreen />);
  });

  afterEach(() => {
    delete globalThis.__TEST_USER_ID__;
  });

  test("renders statistics", async () => {
    expect(await screen.findByText("3 Sets")).toBeInTheDocument();
    expect(await screen.findByText("3 Languages")).toBeInTheDocument();
    expect(await screen.findByText("4 Cards")).toBeInTheDocument();
    expect(await screen.findByText("2 Remembered")).toBeInTheDocument();
    expect(await screen.findByText("6 Repetitions")).toBeInTheDocument();
  });
  test("renders recent decks", async () => {
    expect(await screen.findByText("Spanish Basics")).toBeInTheDocument();
    expect(await screen.findByText("French Travel")).toBeInTheDocument();
    expect(await screen.findByText("German Grammar")).toBeInTheDocument();
  });
  test("renders goal, streak and progress", async () => {
    const goalButton = await screen.findByRole("button", { name: "50" });
    await waitFor(() => {
      expect(goalButton).toHaveClass("bg-blue-600", "text-white");
    });

    const repetitionText = await screen.findByText(/Repetitions Today/);
    const repetitionDiv = repetitionText.closest("div");
    expect(repetitionDiv).toHaveClass("bg-green-400");
    expect(
      await screen.findByText("Current Streak: 5 Days")
    ).toBeInTheDocument();
  });
  test("changes goal", async () => {
    const otherGoalButton = await screen.findByRole("button", { name: "100" });
    await user.click(otherGoalButton);
    expect(otherGoalButton).toHaveClass("bg-blue-600", "text-white");
  });
  test("link to deck has correct url", async () => {
    const deckLink = await screen.findByRole("link", {
      name: /spanish basics/i,
    });
    expect(deckLink).toHaveAttribute("href", "/decks/deck1");
  });
  test("renders loader on component render", async () => {
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });
});

describe("HomeScreen - user without decks", () => {
  beforeEach(() => {
    globalThis.__TEST_USER_ID__ = "2";

    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      user: { _id: "2", email: "user@example.com", name: "Test User" },
      setUser: vi.fn(),
      logout: vi.fn(),
    });

    render(<HomeScreen />);
  });

  afterEach(() => {
    delete globalThis.__TEST_USER_ID__;
  });

  test("renders empty statistics", async () => {
    expect(await screen.findByText("0 Sets")).toBeInTheDocument();
    expect(await screen.findByText("0 Languages")).toBeInTheDocument();
    expect(await screen.findByText("0 Cards")).toBeInTheDocument();
    expect(await screen.findByText("0 Remembered")).toBeInTheDocument();
    expect(await screen.findByText("0 Repetitions")).toBeInTheDocument();
  });
  test("renders link to /decks", async () => {
    const decksLink = await screen.findByRole("link", {
      name: /go to decks/i,
    });
    expect(decksLink).toHaveAttribute("href", "/decks");
  });
  test("renders goal, no streak and no progress", async () => {
    const goalButton = await screen.findByRole("button", { name: "20" });
    await waitFor(() => {
      expect(goalButton).toHaveClass("bg-blue-600", "text-white");
    });

    const repetitionText = await screen.findByText(/Repetitions Today/);
    const repetitionDiv = repetitionText.closest("div");
    expect(repetitionDiv).toHaveClass("bg-yellow-200");
    expect(
      await screen.findByText("Current Streak: 0 Days")
    ).toBeInTheDocument();
  });
});
