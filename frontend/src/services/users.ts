import axios from "axios";
import type { User } from "../types";
import type { UserProfileFormData } from "../validation/userSchemas";

export async function fetchUser(): Promise<User> {
  const { data } = await axios.get("/api/users/profile");
  return data;
}

export async function logoutUser() {
  await axios.post("/api/users/logout", {}, { withCredentials: true });
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<User> {
  const { data: loggedInUser } = await axios.post(
    "/api/users/login",
    {
      email: data.email,
      password: data.password,
    },
    { withCredentials: true }
  );

  return loggedInUser;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const { data: createdUser } = await axios.post(
    "/api/users",
    { name: data.name, email: data.email, password: data.password },
    { withCredentials: true }
  );

  return createdUser;
}

export async function updateUser(data: UserProfileFormData): Promise<User> {
  const { data: updatedUser } = await axios.put("/api/users/profile", {
    name: data.name,
    email: data.email,
    password: data.password,
  });

  return updatedUser;
}
