import { render } from "testUtils";
import { Home } from "./Home";

test("smoke home render", () => {
  const { getByText } = render(<Home />);

  expect(
    getByText(/Planetary Computer for a Sustainable Future/i)
  ).toBeInTheDocument();
});
