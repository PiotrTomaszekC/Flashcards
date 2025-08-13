import { render, type RenderOptions } from "@testing-library/react";
import { AuthProvider } from "../src/context/authContext";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactElement } from "react";

const createTestClient = () => new QueryClient();

const AllTheProviders = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <QueryClientProvider client={createTestClient()}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  </MemoryRouter>
);

const renderWithAuth = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { renderWithAuth as render };
