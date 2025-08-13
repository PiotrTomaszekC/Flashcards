import { toast } from "react-toastify";
import { useLogout } from "../hooks/useUsers";
import Loader from "./Loader";
import { useTranslation } from "react-i18next";

interface ModalConfirmLogoutProps {
  logout: () => void;
  setIsLogout: (value: boolean) => void;
}

export default function ModalConfirmLogout({
  logout,
  setIsLogout,
}: ModalConfirmLogoutProps) {
  const { mutate: logoutUser, status } = useLogout();
  const { t } = useTranslation();

  const isLoading = status === "pending";

  function handleLogout() {
    logoutUser(undefined, {
      onSuccess: () => {
        logout();
        toast.success(t("toasts.loggedOut"));
        setIsLogout(false);
      },
    });
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
            {t("confirmLogout")}
          </h3>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setIsLogout(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors cursor-pointer"
            >
              {t("cancel")}
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
              onClick={handleLogout}
            >
              {t("logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
