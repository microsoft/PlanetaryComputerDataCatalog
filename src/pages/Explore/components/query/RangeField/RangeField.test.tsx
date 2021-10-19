import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "pages/Explore/utils/testUtils";

import { RangeField } from "./RangeField";
import { CqlExpressionParser } from "pages/Explore/utils/cql";
import {
  CqlBetweenExpression,
  CqlEqualExpression,
  CqlGteExpression,
  CqlLteExpression,
} from "pages/Explore/utils/cql/types";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser";

const queryable: JSONSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  properties: {
    "eo:cloud_cover": {
      title: "Cloud Cover",
      type: "number",
      minimum: 0,
      maximum: 100,
    },
  },
};

const gte: CqlGteExpression = { gte: [{ property: "eo:cloud_cover" }, 10] };
const lte: CqlLteExpression = { lte: [{ property: "eo:cloud_cover" }, 10] };
const eq: CqlEqualExpression = { eq: [{ property: "eo:cloud_cover" }, 10] };
const bt: CqlBetweenExpression = {
  between: { value: { property: "eo:cloud_cover" }, lower: 25, upper: 75 },
};

test("it displays correct title and formatted value for GTE", async () => {
  const field = new CqlExpressionParser<number>(gte, queryable);
  const { getByText } = render(<RangeField field={field} icon="search" />);

  expect(getByText(/Cloud Cover: over 10%/i)).toBeInTheDocument();

  fireEvent.click(screen.getByTestId("rangecontrol-eo:cloud_cover"));
  await waitFor(() => screen.getByRole("dialog"));

  expect(screen.getByText("10%", { exact: true })).toBeInTheDocument();
  expect(screen.getByText("100%", { exact: true })).toBeInTheDocument();
});

test("it displays correct title and formatted value for LTE", async () => {
  const field = new CqlExpressionParser<number>(lte, queryable);
  const { getByText } = render(<RangeField field={field} icon="search" />);

  expect(getByText(/Cloud Cover: under 10%/i)).toBeInTheDocument();

  fireEvent.click(screen.getByTestId("rangecontrol-eo:cloud_cover"));
  await waitFor(() => screen.getByRole("dialog"));

  expect(screen.getByText("0%", { exact: true })).toBeInTheDocument();
  expect(screen.getByText("10%", { exact: true })).toBeInTheDocument();
});

test("it displays correct title and formatted value for EQ", async () => {
  const field = new CqlExpressionParser<number>(eq, queryable);
  render(<RangeField field={field} icon="search" />);

  const label = screen.getByText(/Cloud Cover: exactly 10%/i);
  expect(label).toBeInTheDocument();

  fireEvent.click(screen.getByTestId("rangecontrol-eo:cloud_cover"));
  await waitFor(() => screen.getByRole("dialog"));

  const dialog = screen.getByRole("dialog");
  expect(within(dialog).getAllByText(/10%/i).length === 2);
});

test("it displays correct title and formatted value for BETWEEN", async () => {
  const field = new CqlExpressionParser<number>(bt, queryable);
  render(<RangeField field={field} icon="search" />);

  const label = screen.getByText(/Cloud Cover: 25% - 75%/i);
  expect(label).toBeInTheDocument();

  fireEvent.click(screen.getByTestId("rangecontrol-eo:cloud_cover"));
  await waitFor(() => screen.getByRole("dialog"));
});
