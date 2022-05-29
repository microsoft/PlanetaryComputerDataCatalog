import { render } from "testUtils";
import { CatalogBanner } from "../Catalog.Banner";
import userEvent from "@testing-library/user-event";

const setupInput = (
  filterText: string | undefined = undefined,
  handleFn: (text: string) => void = () => {}
) => {
  const utils = render(
    <CatalogBanner filterText={filterText} onFilterChange={handleFn} />
  );
  const input = utils.getByTestId("catalog-filter-input");
  return {
    input,
    ...utils,
  };
};

test("Banner render", () => {
  const { getAllByText } = render(
    <CatalogBanner filterText={undefined} onFilterChange={() => {}} />
  );
  expect(getAllByText(/Data Catalog/i));
});

test("Banner renders filter input", () => {
  const { input } = setupInput();
  expect(input).toBeInTheDocument();
});

test("Banner renders filter input with initial state value", () => {
  const init = "landcover";
  const { input } = setupInput(init, () => {});
  expect(input).toHaveValue(init);
});

test("Typing filter invokes callback", async () => {
  const user = userEvent.setup();
  const fn = jest.fn();
  const init = undefined;
  const { input } = setupInput(init, fn);

  input.focus();
  await user.keyboard("land");
  expect(input).toHaveValue("land");

  expect(fn).toHaveBeenCalledTimes(4);
});
