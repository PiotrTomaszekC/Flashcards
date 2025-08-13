// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Loader from "../components/Loader";
// import { useAuth } from "../context/authContext";
// import { useLogin } from "../hooks/useUsers";
// import { useTranslation } from "react-i18next";

// export default function LoginScreen() {
//   const { user, setUser } = useAuth();
//   const navigate = useNavigate();
//   const { mutate: loginUser, status } = useLogin(setUser);
//   const isLoading = status === "pending";
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { t } = useTranslation();

//   useEffect(
//     function () {
//       if (user) {
//         navigate("/");
//       }
//     },
//     [user, navigate]
//   );

//   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     loginUser({ email, password }, { onSuccess: () => navigate("/") });
//   }

//   return (
//     <>
//       <div className="flex flex-col gap-4 items-center">
//         <h2 className="uppercase text-4xl font-semibold">{t("login")}</h2>
//         <form
//           className="w-full sm:w-[70%] lg:w-1/3 p-6 bg-white shadow-md rounded flex flex-col items-center justify-center text-2xl gap-10"
//           onSubmit={handleSubmit}
//         >
//           <div className="flex flex-col items-center gap-3 w-full lg:w-2/3">
//             <label htmlFor="email">Email</label>{" "}
//             <input
//               type="email"
//               className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="flex flex-col items-center gap-3 w-full lg:w-2/3">
//             <label htmlFor="password">{t("password")}</label>{" "}
//             <input
//               type="password"
//               className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div className="min-h-[48px]">
//             {isLoading ? (
//               <Loader />
//             ) : (
//               <button
//                 type="submit"
//                 className="bg-blue-600 py-2 px-5 rounded-md hover:bg-blue-700 text-white font-semibold transition-colors cursor-pointer"
//               >
//                 {t("login")}
//               </button>
//             )}
//           </div>
//         </form>
//         <div className="text-lg text-center">
//           {t("noAccount")}
//           <br />
//           <Link to="/register" className="hover:text-blue-400 underline w-full">
//             {t("registerHere")}
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// }

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../context/authContext";
import { useLogin } from "../hooks/useUsers";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { mutate: loginUser, status } = useLogin(setUser);
  const isLoading = status === "pending";
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onSubmit = (data: LoginFormInputs) => {
    loginUser(data, {
      onSuccess: () => navigate("/"),
    });
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="uppercase text-4xl font-semibold">{t("login")}</h2>
      <form
        className="w-full sm:w-[70%] lg:w-1/3 p-6 bg-white shadow-md rounded flex flex-col items-center justify-center text-2xl gap-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-3 w-full lg:w-2/3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-red-600 text-base">{t("emailRequired")}</p>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 w-full lg:w-2/3">
          <label htmlFor="password">{t("password")}</label>
          <input
            type="password"
            id="password"
            className="border-blue-400 border rounded-md w-full p-2 focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <p className="text-red-600 text-base">{t("passwordRequired")}</p>
          )}
        </div>

        <div className="min-h-[48px]">
          {isLoading ? (
            <Loader />
          ) : (
            <button
              type="submit"
              className="bg-blue-600 py-2 px-5 rounded-md hover:bg-blue-700 text-white font-semibold transition-colors cursor-pointer"
            >
              {t("login")}
            </button>
          )}
        </div>
      </form>

      <div className="text-lg text-center">
        {t("noAccount")}
        <br />
        <Link to="/register" className="hover:text-blue-400 underline w-full">
          {t("registerHere")}
        </Link>
      </div>
    </div>
  );
}
