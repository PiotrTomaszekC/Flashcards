import userEvent, { type UserEvent } from "@testing-library/user-event";
import { render, screen, waitFor } from "../testing-library-utils";
import LoginScreen from "./../../src/screens/LoginScreen";
import { expect, describe, beforeEach } from "vitest";
import { toast } from "react-toastify";
import * as AuthContext from "../../src/context/authContext";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

let user: UserEvent;
let emailInput: HTMLElement;
let passwordInput: HTMLElement;
let loginButton: HTMLElement;

beforeEach(() => {
  user = userEvent.setup();
  render(<LoginScreen />);
  emailInput = screen.getByLabelText(/email/i);
  passwordInput = screen.getByLabelText(/password/i);
  loginButton = screen.getByRole("button", { name: /log in/i });
});

test("Display heading, inputs and button", () => {
  expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
});

describe("Typing into form inputs", () => {
  test("Updates email and password fields", async () => {
    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "123456");
    expect(emailInput).toHaveValue("user@example.com");
    expect(passwordInput).toHaveValue("123456");
  });

  test("Shows loader on form submit", async () => {
    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "123456");
    await user.click(loginButton);
    expect(await screen.findByRole("status")).toBeInTheDocument();
  });
});

describe("Form submission results in", () => {
  test("Error toast on wrong credentials", async () => {
    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "123");
    await user.click(loginButton);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });
  test("Redirection after successfull login", async () => {
    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "123456");
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});

test("Automatically redirects if user is already logged in", () => {
  vi.spyOn(AuthContext, "useAuth").mockReturnValue({
    user: { _id: "1", email: "user@example.com", name: "Test User" },
    setUser: vi.fn(),
    logout: vi.fn(),
  });

  render(<LoginScreen />);
  expect(mockNavigate).toHaveBeenCalledWith("/");
});

test("Link is pointing at /register route", async () => {
  const registerLink = screen.getByRole("link", { name: "Register here →" });
  expect(registerLink).toHaveAttribute("href", "/register");
});
