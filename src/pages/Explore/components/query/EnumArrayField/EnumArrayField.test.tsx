import { render, screen } from "pages/Explore/utils/testUtils";

import { EnumArrayField } from "./EnumArrayField";
import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { CqlEqualExpression } from "pages/Explore/utils/cql/types";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser";

const queryable: JSONSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  properties: {
    "sar:polarization": {
      title: "Polarization",
      type: "array",
      enum: [["HH,HV"], ["VV, VH"]],
    },
  },
};

const eq: CqlEqualExpression<string[]> = {
  op: "=",
  args: [{ property: "sar:polarization" }, ["HH", "HV"]],
};

test("it displays correct title and formatted value for EQ", async () => {
  const field = new CqlExpressionParser<string[]>(eq, queryable);
  render(<EnumArrayField field={field} />);

  const label = screen.getByText("Polarization");
  expect(label).toBeInTheDocument();

  const value = screen.getByText("[HH,HV]");
  expect(value).toBeInTheDocument();
});
