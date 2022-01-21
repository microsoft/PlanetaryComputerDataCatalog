import { render, screen } from "pages/Explore/utils/testUtils";

import { EnumField } from "./EnumField";
import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { CqlEqualExpression, CqlInExpression } from "pages/Explore/utils/cql/types";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser";

const queryable: JSONSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  properties: {
    "goes:image-type": {
      description: "Image type",
      type: "string",
      title: "Image Type",
      enum: ["FULL DISK", "CONUS", "MESOSCALE"],
    },
  },
};

const eq: CqlEqualExpression<string> = {
  op: "=",
  args: [{ property: "goes:image-type" }, "FULL DISK"],
};
const inExp: CqlInExpression<string> = {
  op: "in",
  args: [{ property: "goes:image-type" }, ["FULL DISK", "MESOSCALE"]],
};
const inExpEmpty: CqlInExpression<string> = {
  op: "in",
  args: [{ property: "goes:image-type" }, []],
};

test("it displays correct title and formatted value for EQ", async () => {
  const field = new CqlExpressionParser<string>(eq, queryable);
  render(<EnumField field={field} />);

  const label = screen.getByText("Image Type");
  expect(label).toBeInTheDocument();

  const value = screen.getByText("FULL DISK");
  expect(value).toBeInTheDocument();
});

test("it displays correct title and formatted value for IN", async () => {
  const field = new CqlExpressionParser<string>(inExp, queryable);
  render(<EnumField field={field} />);

  const label = screen.getByText("Image Type");
  expect(label).toBeInTheDocument();

  const value = screen.getByText("FULL DISK, MESOSCALE");
  expect(value).toBeInTheDocument();
});

test("it displays correct title and formatted value for empty IN", async () => {
  const field = new CqlExpressionParser<string>(inExpEmpty, queryable);
  render(<EnumField field={field} />);

  const label = screen.getByText("Image Type");
  expect(label).toBeInTheDocument();

  const value = screen.getByText("Include all");
  expect(value).toBeInTheDocument();
});
