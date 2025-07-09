import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./context/authContext.tsx";
import "./index.css";
import AddCardScreen from "./screens/AddCardScreen.tsx";
import HomeScreen from "./screens/HomeScreen.tsx";
import LearnSreen from "./screens/LearnScreen.tsx";
import LoginScreen from "./screens/LoginScreen.tsx";
import RegisterScreen from "./screens/RegisterScreen.tsx";
import AllDecksScreen from "./screens/AllDecksScreen.tsx";
import DeckScreen from "./screens/DeckScreen.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/decks" element={<AllDecksScreen />} />
      <Route path="/decks/:id" element={<DeckScreen />} />
      <Route path="/addCard" element={<AddCardScreen />} />
      <Route path="/learn" element={<LearnSreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
