import { render, type RenderOptions } from "@testing-library/react";
import { AuthProvider } from "../src/context/authContext";
import { MemoryRouter } from "react-router-dom";
import { type ReactElement } from "react";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);

const renderWithAuth = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { renderWithAuth as render };
