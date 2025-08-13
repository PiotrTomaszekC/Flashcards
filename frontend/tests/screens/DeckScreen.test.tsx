import { render, screen } from "@testing-library/react";
import { Route, Routes, MemoryRouter } from "react-router-dom";
import DeckScreen from "../../src/screens/DeckScreen";
import * as AuthContext from "../../src/context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("DeckScreen", () => {
  beforeEach(() => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      user: { _id: "1", email: "user@example.com", name: "Test User" },
      setUser: vi.fn(),
      logout: vi.fn(),
    });
  });

  test("renders deck1 heading and link to add a card", async () => {
    const createTestClient = () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });

    render(
      <MemoryRouter initialEntries={["/deck/deck1"]}>
        <QueryClientProvider client={createTestClient()}>
          <Routes>
            <Route path="/deck/:id" element={<DeckScreen />} />
          </Routes>
        </QueryClientProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: /Spanish Basics/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add Card" })).toHaveAttribute(
      "href",
      "/addCard?deck=deck1"
    );
  });
});
