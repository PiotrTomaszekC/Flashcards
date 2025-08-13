import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import Loader from "../components/Loader";
import { useAuth } from "../context/authContext";
import { useUpdateUser } from "../hooks/useUsers";
import {
  userProfileSchema,
  type UserProfileFormData,
} from "../validation/userSchemas";
import { useTranslation } from "react-i18next";

export default function UserProfileScreen() {
  const { user, setUser } = useAuth();
  const { mutate: updateUser, status } = useUpdateUser(setUser);
  const isUpdating = status === "pending";
  const { t } = useTranslation();

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

  function onSubmit(data: UserProfileFormData) {
    updateUser(data);
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
        {t("updateProfile")}
      </h1>

      <form
        className="w-full sm:w-[80%] lg:w-[30%] flex flex-col bg-white rounded-md p-6 text-2xl gap-6 shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Name */}
        <div className="flex flex-col items-start gap-1 w-full">
          <label htmlFor="name">{t("name")}</label>
          <input
            id="name"
            type="text"
            className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            {...register("name")}
          />
          {errors?.name?.message && (
            <p className="text-red-600 text-base">{t(errors.name.message)}</p>
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
            <p className="text-red-600 text-base">{t(errors.email.message)}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col items-start gap-1 w-full">
          <label htmlFor="password">{t("newPassword")}</label>
          <input
            id="password"
            type="password"
            className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            {...register("password")}
          />
          {errors?.password?.message && (
            <p className="text-red-600 text-base">
              {t(errors.password.message)}
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col items-start gap-1 w-full">
          <label htmlFor="confirmPassword">{t("confirmNewPassword")}</label>
          <input
            id="confirmPassword"
            type="password"
            className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            {...register("confirmPassword")}
          />
          {errors?.confirmPassword?.message && (
            <p className="text-red-600 text-base">
              {t(errors.confirmPassword.message)}
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
          {t("updateProfileB")}
        </button>
      </form>
    </div>
  );
}
