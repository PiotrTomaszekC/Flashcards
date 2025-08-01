import { useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

export default function UserProfileScreen() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user!.name);
  const [email, setEmail] = useState(user!.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !name.trim() &&
      !email.trim() &&
      !password.trim() &&
      !confirmPassword.trim()
    ) {
      alert("No data entered");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setIsUpdating(true);
    try {
      const { data: updatedUser } = await axios.put("/api/users/profile", {
        name,
        email,
        password,
      });
      setUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      toast.success("User profile updated!");
      setPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Update failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsUpdating(false);
    }
  }

  const isFormUnchanged =
    name === user!.name &&
    email === user!.email &&
    password.trim() === "" &&
    confirmPassword.trim() === "";

  const isFormInvalid =
    !name.trim() ||
    !email.trim() ||
    (password.trim() !== "" && password !== confirmPassword);

  const isButtonDisabled = isFormUnchanged || isFormInvalid;

  if (isUpdating) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="uppercase text-4xl font-semibold max-sm:text-center">
        Update User Profile
      </h1>

      <form
        className="w-full sm:w-[80%] lg:w-[30%] flex flex-col bg-white rounded-md p-6 text-2xl gap-6 shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-start gap-1 w-full">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>

        <div className="flex flex-col items-start gap-1 w-full">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>

        <div className="flex flex-col items-start gap-1 w-full">
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>

        <div className="flex flex-col items-start gap-1 w-full">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
        </div>

        <button
          type="submit"
          disabled={isButtonDisabled}
          className={` rounded-md transition-colors cursor-pointer mr-auto p-2 font-semibold ${
            isButtonDisabled
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Update profile
        </button>
      </form>
    </div>
  );
}
