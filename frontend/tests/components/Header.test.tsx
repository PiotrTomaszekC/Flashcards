import Header from "../../src/components/Header";
import * as AuthContext from "../../src/context/authContext";
import { render, screen } from "../testing-library-utils";

describe("Header - logged in user", () => {
  beforeEach(() => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      user: { _id: "1", email: "user@example.com", name: "Test User" },
      setUser: vi.fn(),
      logout: vi.fn(),
    });
    render(<Header />);
  });

  test("renders links", () => {
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: "My Decks" })).toHaveAttribute(
      "href",
      "/decks"
    );
    expect(screen.getByRole("link", { name: "Add Card" })).toHaveAttribute(
      "href",
      "/addCard"
    );
    expect(screen.getByRole("link", { name: "Learn" })).toHaveAttribute(
      "href",
      "/learn"
    );
  });
  test("renders link to user profile & logout button", () => {
    expect(screen.getByRole("link", { name: "Test User" })).toHaveAttribute(
      "href",
      "/user"
    );
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });
});

describe("Header - no logged in user", () => {
  beforeEach(() => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      user: null,
      setUser: vi.fn(),
      logout: vi.fn(),
    });
    render(<Header />);
  });

  test("renders Log in link", () => {
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute(
      "href",
      "/login"
    );
  });
});
