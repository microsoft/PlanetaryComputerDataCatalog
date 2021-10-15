import React from "react";
import { render } from "@testing-library/react";
import Home from "./Home";
import { MemoryRouter } from "react-router";

test("smoke home render", () => {
  const { getByText } = render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(
    getByText(/Planetary Computer for a Sustainable Future/i)
  ).toBeInTheDocument();
});
