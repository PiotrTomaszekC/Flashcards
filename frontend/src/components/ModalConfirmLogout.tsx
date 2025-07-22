import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "./Loader";

interface ModalConfirmLogoutProps {
  logout: () => void;
  setIsLogout: (value: boolean) => void;
}

export default function ModalConfirmLogout({
  logout,
  setIsLogout,
}: ModalConfirmLogoutProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    await axios.post("/api/users/logout", {}, { withCredentials: true });
    //add { withCredentials: true } for safety when later the site is deployed to render etc.
    logout();
    setIsLoading(false);
    toast.success("User logged out");
    setIsLogout(false);
  }

  return (
    <div
      className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50"
      onClick={() => setIsLogout(false)}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className="bg-white p-6 rounded shadow-lg w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold mb-4 text-center">
            Are you sure you want to log out?
          </h3>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setIsLogout(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
