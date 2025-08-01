import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";

export default function App() {
  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 mx-4 sm:mx-10 my-6">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </>
  );
}
