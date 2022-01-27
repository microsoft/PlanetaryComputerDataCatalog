import { render } from "@testing-library/react";
import { Home } from "./Home";
import { MemoryRouter, Routes, Route } from "react-router";

test("smoke home render", () => {
  const { getByText } = render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </MemoryRouter>
  );

  expect(
    getByText(/Planetary Computer for a Sustainable Future/i)
  ).toBeInTheDocument();
});
