import { userEvent, type UserEvent } from "@testing-library/user-event";
import { render, screen, waitFor } from "../testing-library-utils";
import RegisterScreen from "../../src/screens/RegisterScreen";
import * as AuthContext from "../../src/context/authContext";
import { toast } from "react-toastify";

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
let nameInput: HTMLElement;
let emailInput: HTMLElement;
let passwordInput: HTMLElement;
let confirmPasswordInput: HTMLElement;
let registerButton: HTMLElement;

beforeEach(() => {
  vi.clearAllMocks();
  user = userEvent.setup();
  render(<RegisterScreen />);
  nameInput = screen.getByLabelText(/name/i);
  emailInput = screen.getByLabelText(/email/i);
  passwordInput = screen.getByLabelText("Password");
  confirmPasswordInput = screen.getByLabelText("Confirm Password");
  registerButton = screen.getByRole("button", { name: /register/i });
});

test("Display heading, inputs and button", () => {
  expect(
    screen.getByRole("heading", { name: "Register new user" })
  ).toBeInTheDocument();
  expect(nameInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(confirmPasswordInput).toBeInTheDocument();
  expect(registerButton).toBeInTheDocument();
});

describe("Form behavior", () => {
  test("Updates name, email, password and confirmPassword fields on user input", async () => {
    await user.type(nameInput, "example user");
    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "123456");
    await user.type(confirmPasswordInput, "123456");
    expect(nameInput).toHaveValue("example user");
    expect(emailInput).toHaveValue("user@example.com");
    expect(passwordInput).toHaveValue("123456");
    expect(confirmPasswordInput).toHaveValue("123456");
  });

  test("Shows loader on form submit", async () => {
    await user.type(nameInput, "example user");
    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "Mx123456");
    await user.type(confirmPasswordInput, "Mx123456");
    await user.click(registerButton);
    expect(await screen.findByRole("status")).toBeInTheDocument();
  });
});

test("Redirects if user is already logged in", () => {
  vi.spyOn(AuthContext, "useAuth").mockReturnValue({
    user: { _id: "1", email: "user@example.com", name: "Test User" },
    setUser: vi.fn(),
    logout: vi.fn(),
  });

  render(<RegisterScreen />);
  expect(mockNavigate).toHaveBeenCalledWith("/");
});

describe("Form submission results", () => {
  test("Form errors show error notifications", async () => {
    await user.type(nameInput, "example user");
    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "Mx123456");
    await user.type(confirmPasswordInput, "123");
    await user.click(registerButton);
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  test("Redirects after successfull registration", async () => {
    await user.type(nameInput, "example user");
    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "Mx123456");
    await user.type(confirmPasswordInput, "Mx123456");
    await user.click(registerButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("Shows error toast when email is already taken", async () => {
    await user.type(nameInput, "taken user");
    await user.type(emailInput, "taken@example.com");
    await user.type(passwordInput, "Mx123456");
    await user.type(confirmPasswordInput, "Mx123456");
    await user.click(registerButton);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Email already in use");
    });
  });
});

test("Checks if Link is pointing at /login route", async () => {
  const loginLink = screen.getByRole("link", { name: /log in/i });
  expect(loginLink).toHaveProperty("href", "http://localhost:3000/login");
});
