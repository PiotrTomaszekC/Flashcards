import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import type { AxiosError } from "axios";

export default function LoginScreen() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (user) {
        navigate("/");
      }
    },
    [user, navigate]
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setIsLoading(true);

      const { data } = await axios.post(
        "/api/users/login",
        { email, password },
        { withCredentials: true }
        //this tells axios to include cookies
      );

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      //we update both user React state (in context) and local storage. First allows to immediately update the UI based on the new user data but it only runs in memory while the app is running. Local storage persists the user data across page reloads
      toast.success("Login successfull!");
      navigate("/");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      //we need to use AxiosError type, otherwise TS complains
      const message =
        err.response?.data?.message || "Invalid email or password";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 items-center">
        <h2 className="uppercase text-4xl font-semibold">Login</h2>
        <form
          className="w-1/3 p-6 bg-white shadow-md rounded flex flex-col items-center justify-center text-2xl gap-10"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-center gap-3 w-2/3">
            <label htmlFor="email">Email</label>{" "}
            <input
              type="email"
              className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col items-center gap-3 w-2/3">
            <label htmlFor="password">Password</label>{" "}
            <input
              type="password"
              className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="min-h-[48px]">
            {isLoading ? (
              <Loader />
            ) : (
              <button
                type="submit"
                className="bg-blue-600 py-2 px-5 rounded-md hover:bg-blue-700 text-white font-semibold transition-colors"
              >
                Log in
              </button>
            )}
          </div>
        </form>
        <div className="text-lg text-center">
          Don't have an account yet?
          <br />
          <Link to="/register" className="hover:text-blue-400 underline w-full">
            Register here →
          </Link>
        </div>
      </div>
    </>
  );
}
