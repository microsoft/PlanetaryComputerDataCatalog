import { FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@fluentui/react";
import { QueryClient, QueryClientProvider } from "react-query";

import axios from "axios";
axios.defaults.adapter = require("axios/lib/adapters/http");
export const axiosForMock = axios;

const AllTheProviders: FC = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={children} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
