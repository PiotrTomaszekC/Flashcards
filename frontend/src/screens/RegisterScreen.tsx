import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useAuth } from "../context/authContext";
import {
  userRegisterSchema,
  type UserRegisterFormData,
} from "../validation/userSchemas";

export default function RegisterScreen() {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegisterFormData>({
    resolver: zodResolver(userRegisterSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: UserRegisterFormData) {
    try {
      setIsLoading(true);
      const { data: createdUser } = await axios.post(
        "/api/users",
        { name: data.name, email: data.email, password: data.password },
        { withCredentials: true }
        //this tells axios to include cookies
      );
      setUser(createdUser);
      localStorage.setItem("userInfo", JSON.stringify(createdUser));
      //we update both user React state (in context) and local storage. First allows to immediately update the UI based on the new user data but it only runs in memory while the app is running. Local storage persists the user data across page reloads
      toast.success("User successfully registered");
      navigate("/");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      //we need to use AxiosError type, otherwise TS complains
      const message =
        err.response?.data?.message || "Invalid name, email or password";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 items-center">
        <h2 className="uppercase text-4xl font-semibold">Register new user</h2>
        <form
          className="w-full sm:w-[70%] lg:w-1/3 p-6 bg-white shadow-md rounded flex flex-col items-center justify-center text-2xl gap-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Name */}
          <div className="flex flex-col items-center gap-3 w-full lg:w-2/3">
            <label htmlFor="name">Name</label>{" "}
            <input
              type="text"
              className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
              id="name"
              {...register("name")}
            />
            {errors?.name?.message && (
              <p className="text-red-600 text-base">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col items-center gap-3 w-full lg:w-2/3">
            <label htmlFor="email">Email</label>{" "}
            <input
              type="email"
              className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
              id="email"
              {...register("email")}
            />
            {errors?.email?.message && (
              <p className="text-red-600 text-base">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col items-center gap-3 w-full lg:w-2/3">
            <label htmlFor="password">Password</label>{" "}
            <input
              type="password"
              className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
              id="password"
              {...register("password")}
            />
            {errors?.password?.message && (
              <p className="text-red-600 text-base">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col items-center gap-3 w-full lg:w-2/3">
            <label htmlFor="confirmPassword">Confirm Password</label>{" "}
            <input
              type="password"
              className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
              id="confirmPassword"
              {...register("confirmPassword")}
            />
            {errors?.confirmPassword?.message && (
              <p className="text-red-600 text-base">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="min-h-[48px]">
            {isLoading ? (
              <Loader />
            ) : (
              <button
                type="submit"
                className="bg-blue-600 py-2 px-5 rounded-md hover:bg-blue-700 text-white font-semibold transition-colors"
              >
                Register
              </button>
            )}
          </div>
        </form>
        <div className="text-lg text-center">
          Already registered user?
          <br />
          <Link to="/login" className="hover:text-blue-400 underline w-full">
            Log in →
          </Link>
        </div>
      </div>
    </>
  );
}
