import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";
import ModalConfirmLogout from "./ModalConfirmLogout";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);

  return (
    <>
      <header className="py-4 text-4xl bg-white px-6 flex justify-between items-center">
        <div className="flex items-center gap-10">
          <Link to="/" className="font-bold text-blue-600">
            Flashcards
          </Link>
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-10 text-xl uppercase items-center">
            {["/", "/decks", "/addCard", "/learn"].map((path, idx) => (
              <NavLink
                key={idx}
                to={path}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 hover:underline max-lg:text-center"
                    : "hover:text-blue-500 hover:underline max-lg:text-center"
                }
              >
                {[t("home"), t("myDecks"), t("addCard"), t("learn")][idx]}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Auth Buttons */}

        <div className="text-xl hidden md:block ml-10">
          {user ? (
            <div className="flex gap-5 items-center max-lg:text-center">
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="focus:outline-none text-2xl"
              >
                <option value="en">🇬🇧</option>
                <option value="pl">🇵🇱</option>
                <option value="es">🇪🇸</option>
                <option value="de">🇩🇪</option>
                <option value="fr">🇫🇷</option>
              </select>

              <NavLink
                to="/user"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 flex gap-1 items-center"
                    : "hover:text-blue-500 flex gap-1 items-center transition-colors"
                }
              >
                <FaUser className="text-2xl" />
                <span className="hidden lg:inline">{user.name}</span>
              </NavLink>
              <button
                className="bg-blue-600 p-2 rounded-md hover:bg-blue-700 text-white font-semibold transition-colors cursor-pointer"
                onClick={() => setIsLogout(true)}
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="bg-blue-600 p-2 rounded-md hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              {t("login")}
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-blue-600 text-3xl"
          onClick={() => setMenuOpen((menu) => !menu)}
        >
          ☰
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-18 left-0 w-full bg-white shadow-md flex flex-col items-center p-4 gap-4 text-xl uppercase md:hidden z-50">
            {["/", "/decks", "/addCard", "/learn"].map((path, idx) => (
              <NavLink
                key={idx}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 hover:underline"
                    : "hover:text-blue-500 hover:underline"
                }
              >
                {[t("home"), t("myDecks"), t("addCard"), t("learn")][idx]}
              </NavLink>
            ))}
            {user ? (
              <div className="flex gap-3 items-center border-t-1 border-gray-300 pt-2">
                <select
                  value={i18n.language}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  className="focus:outline-none text-2xl"
                >
                  <option value="en">🇬🇧</option>
                  <option value="pl">🇵🇱</option>
                  <option value="es">🇪🇸</option>
                  <option value="de">🇩🇪</option>
                  <option value="fr">🇫🇷</option>
                </select>
                <NavLink
                  to="/user"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 uppercase font-semibold flex items-center gap-1"
                      : "hover:text-blue-500 uppercase font-semibold flex items-center gap-1"
                  }
                >
                  <FaUser />
                  {user.name}
                </NavLink>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setIsLogout(true);
                  }}
                  className="text-left bg-blue-600 p-2 rounded-md hover:bg-blue-700 text-white font-semibold transition-colors"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-blue-600 p-2 rounded-md hover:bg-blue-700 text-white font-semibold transition-colors"
              >
                {t("login")}
              </NavLink>
            )}
          </div>
        )}
      </header>
      {isLogout && (
        <ModalConfirmLogout logout={logout} setIsLogout={setIsLogout} />
      )}
    </>
  );
}
