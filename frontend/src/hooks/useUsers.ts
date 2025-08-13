import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/authContext";
import {
  fetchUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../services/users";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import type { User } from "../types";
import { useTranslation } from "react-i18next";

export function useUsers() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: !!user,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear(); // clears all cached queries
    },
  });
}

export function useLogin(setUser: (user: User) => void) {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (loggedInUser) => {
      setUser(loggedInUser);
      localStorage.setItem("userInfo", JSON.stringify(loggedInUser));
      toast.success(t("toasts.login"));
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;
      const message =
        err.response?.data?.message || "Invalid email or password";
      toast.error(message);
    },
  });
}

export function useRegister(setUser: (user: User) => void) {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (createdUser) => {
      setUser(createdUser);
      localStorage.setItem("userInfo", JSON.stringify(createdUser));
      toast.success(t("toasts.registered"));
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;
      const message =
        err.response?.data?.message || "Invalid email or password";
      toast.error(message);
    },
  });
}

export function useUpdateUser(setUser: (user: User) => void) {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      toast.success(t("toasts.profileUpdated"));
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Update failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
}
