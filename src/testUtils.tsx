import { FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@fluentui/react";

const AllTheProviders: FC = ({ children }) => {
  return (
    <ThemeProvider>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={children} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
