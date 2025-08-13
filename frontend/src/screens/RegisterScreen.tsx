import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../context/authContext";
import { useRegister } from "../hooks/useUsers";
import {
  userRegisterSchema,
  type UserRegisterFormData,
} from "../validation/userSchemas";
import { useTranslation } from "react-i18next";

export default function RegisterScreen() {
  const { user, setUser } = useAuth();
  const { mutate: registerUser, status } = useRegister(setUser);
  const isLoading = status === "pending";
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  function onSubmit(data: UserRegisterFormData) {
    registerUser(data, { onSuccess: () => navigate("/") });
  }

  return (
    <>
      <div className="flex flex-col gap-4 items-center">
        <h2 className="uppercase text-4xl font-semibold">
          {t("registerUser")}
        </h2>
        <form
          className="w-full sm:w-[70%] lg:w-1/3 p-6 bg-white shadow-md rounded flex flex-col items-center justify-center text-2xl gap-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Name */}
          <div className="flex flex-col items-center gap-3 w-full lg:w-2/3">
            <label htmlFor="name">{t("name")}</label>{" "}
            <input
              type="text"
              className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
              id="name"
              {...register("name")}
            />
            {errors?.name?.message && (
              <p className="text-red-600 text-base">{t(errors.name.message)}</p>
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
              <p className="text-red-600 text-base">
                {t(errors.email.message)}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col items-center gap-3 w-full lg:w-2/3">
            <label htmlFor="password">{t("password")}</label>{" "}
            <input
              type="password"
              className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
              id="password"
              {...register("password")}
            />
            {errors?.password?.message && (
              <p className="text-red-600 text-base">
                {t(errors.password.message)}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col items-center gap-3 w-full lg:w-2/3">
            <label htmlFor="confirmPassword">{t("confirmPassword")}</label>{" "}
            <input
              type="password"
              className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
              id="confirmPassword"
              {...register("confirmPassword")}
            />
            {errors?.confirmPassword?.message && (
              <p className="text-red-600 text-base">
                {t(errors.confirmPassword.message)}
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
                {t("register")}
              </button>
            )}
          </div>
        </form>
        <div className="text-lg text-center">
          {t("alreadyRegistered")}
          <br />
          <Link to="/login" className="hover:text-blue-400 underline w-full">
            {t("login")} →
          </Link>
        </div>
      </div>
    </>
  );
}
