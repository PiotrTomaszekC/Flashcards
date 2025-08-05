import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useAuth } from "../context/authContext";
import {
  userProfileSchema,
  type UserProfileFormData,
} from "../validation/userSchemas";

export default function UserProfileScreen() {
  const { user, setUser } = useAuth();

  const initialValues = {
    name: user!.name,
    email: user!.email,
    password: "",
    confirmPassword: "",
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserProfileFormData>({
    defaultValues: initialValues,
    resolver: zodResolver(userProfileSchema),
  });
  const watchedValues = useWatch({ control });
  const [isUpdating, setIsUpdating] = useState(false);

  async function onSubmit(data: UserProfileFormData) {
    setIsUpdating(true);
    try {
      const { data: updatedUser } = await axios.put("/api/users/profile", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      toast.success("User profile updated!");
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
    watchedValues.name === initialValues.name &&
    watchedValues.email === initialValues.email &&
    watchedValues.password!.trim() === "" &&
    watchedValues.confirmPassword!.trim() === "";

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
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Name */}
        <div className="flex flex-col items-start gap-1 w-full">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            {...register("name")}
          />
          {errors?.name?.message && (
            <p className="text-red-600 text-base">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col items-start gap-1 w-full">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            {...register("email")}
          />
          {errors?.email?.message && (
            <p className="text-red-600 text-base">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col items-start gap-1 w-full">
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            {...register("password")}
          />
          {errors?.password?.message && (
            <p className="text-red-600 text-base">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col items-start gap-1 w-full">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            {...register("confirmPassword")}
          />
          {errors?.confirmPassword?.message && (
            <p className="text-red-600 text-base">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/*using aria-disabled so that the cursor not allowed icon is displayed on hover*/}
        <button
          type="submit"
          aria-disabled={isFormUnchanged}
          onClick={(e) => {
            if (isFormUnchanged) {
              e.preventDefault();
            }
          }}
          className={`rounded-md transition-colors font-semibold mr-auto p-2 ${
            isFormUnchanged
              ? "bg-gray-400 text-white cursor-not-allowed hover:bg-gray-400"
              : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
          }`}
        >
          Update profile
        </button>
      </form>
    </div>
  );
}
