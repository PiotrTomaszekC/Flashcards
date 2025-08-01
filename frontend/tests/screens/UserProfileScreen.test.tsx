import { userEvent, type UserEvent } from "@testing-library/user-event";
import * as AuthContext from "../../src/context/authContext";
import { render, screen, waitFor } from "../testing-library-utils";
import UserProfileScreen from "../../src/screens/UserProfileScreen";
import { toast } from "react-toastify";

let user: UserEvent;
let nameInput: HTMLElement;
let emailInput: HTMLElement;
let passwordInput: HTMLElement;
let confirmPasswordInput: HTMLElement;
let submitButton: HTMLElement;

vi.spyOn(AuthContext, "useAuth").mockReturnValue({
  user: { _id: "1", email: "user@example.com", name: "Test User" },
  setUser: vi.fn(),
  logout: vi.fn(),
});

beforeEach(() => {
  user = userEvent.setup();
  render(<UserProfileScreen />);
  nameInput = screen.getByLabelText("Name");
  emailInput = screen.getByLabelText("Email");
  passwordInput = screen.getByLabelText("New Password");
  confirmPasswordInput = screen.getByLabelText("Confirm New Password");
  submitButton = screen.getByRole("button", { name: "Update profile" });
});

test("Elements render correctly", () => {
  expect(nameInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(confirmPasswordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

describe("Typing into form inputs", () => {
  test("updates fields", async () => {
    await user.clear(nameInput);
    await user.type(nameInput, "example user");
    await user.clear(emailInput);
    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "123456");
    await user.type(confirmPasswordInput, "123456");
    expect(nameInput).toHaveValue("example user");
    expect(emailInput).toHaveValue("user@example.com");
    expect(passwordInput).toHaveValue("123456");
    expect(confirmPasswordInput).toHaveValue("123456");
  });
  test("Shows loader on form submit", async () => {
    await user.clear(nameInput);
    await user.type(nameInput, "example user");
    await user.clear(emailInput);
    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "123456");
    await user.type(confirmPasswordInput, "123456");
    await user.click(submitButton);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});

describe("Submitting the form", () => {
  test("correctly shows success toast notification and clears password fields", async () => {
    await user.clear(nameInput);
    await user.type(nameInput, "example user");
    await user.clear(emailInput);
    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "123456");
    await user.type(confirmPasswordInput, "123456");
    await user.click(submitButton);
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("User profile updated!");
    });
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
    //the form is re-rendered after the loader disappears so we need to select the elements again
    expect(screen.getByLabelText("New Password")).toHaveValue("");
    expect(screen.getByLabelText("Confirm New Password")).toHaveValue("");
  });
  test("with different passwords makes the button disabled", async () => {
    await user.clear(nameInput);
    await user.type(nameInput, "example user");
    await user.clear(emailInput);
    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "123456");
    await user.type(confirmPasswordInput, "123333");
    expect(submitButton).toBeDisabled();
  });
  test("with the same data makes the button disabled", async () => {
    await user.clear(nameInput);
    await user.type(nameInput, "Test User");
    await user.clear(emailInput);
    await user.type(emailInput, "user@example.com");
    expect(submitButton).toBeDisabled();
  });
});
