import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function Header() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      await axios.post("/api/users/logout", {}, { withCredentials: true });
      //add { withCredentials: true } for safety when later the site is deployed to render etc.
      logout();
      toast.success("User logged out");
    }
  }

  return (
    <header className="py-4 text-4xl bg-white px-6 flex justify-between items-center">
      <div className="flex items-center gap-20">
        <div className="font-bold text-blue-600">Flashcards</div>
        <nav className="flex gap-10 text-xl uppercase">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 hover:underline"
                : "hover:text-blue-500 hover:underline"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/decks"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 hover:underline"
                : "hover:text-blue-500 hover:underline"
            }
          >
            My Decks
          </NavLink>
          <NavLink
            to="/addCard"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 hover:underline"
                : "hover:text-blue-500 hover:underline"
            }
          >
            + Add Card
          </NavLink>
          <NavLink
            to="/learn"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 hover:underline"
                : "hover:text-blue-500 hover:underline"
            }
          >
            Learn
          </NavLink>
        </nav>
      </div>
      <div className="text-xl mr-20">
        {user ? (
          <div className="flex gap-5 items-center">
            <span>Hello, {user.name}</span>
            <button
              className="bg-blue-600 p-2 rounded-md hover:bg-blue-700 text-white font-semibold transition-colors"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="bg-blue-600 p-2 rounded-md hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            Log in
          </NavLink>
        )}
      </div>
    </header>
  );
}
