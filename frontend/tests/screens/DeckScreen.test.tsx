import { render, screen } from "@testing-library/react";
import { Route, Routes, MemoryRouter } from "react-router-dom";
import DeckScreen from "../../src/screens/DeckScreen";

describe("DeckScreen", () => {
  test("renders deck1 heading and link to add a card", async () => {
    render(
      <MemoryRouter initialEntries={["/deck/deck1"]}>
        <Routes>
          <Route path="/deck/:id" element={<DeckScreen />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: /Spanish Basics/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "+ Add Flashcard" })
    ).toHaveAttribute("href", "/addCard?deck=deck1");
  });
});
