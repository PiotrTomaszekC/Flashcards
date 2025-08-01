import ModalConfirmLogout from "../../src/components/ModalConfirmLogout";
import { render, screen } from "../testing-library-utils";

const mockLogout = () => {};
const mockSetIsLogout = () => {};

beforeEach(() => {
  render(
    <ModalConfirmLogout logout={mockLogout} setIsLogout={mockSetIsLogout} />
  );
});

test("renders buttons", async () => {
  const cancelButton = screen.getByRole("button", { name: "Cancel" });
  expect(cancelButton).toBeInTheDocument();
  const logoutButton = screen.getByRole("button", { name: "Log out" });
  expect(logoutButton).toBeInTheDocument();
});
