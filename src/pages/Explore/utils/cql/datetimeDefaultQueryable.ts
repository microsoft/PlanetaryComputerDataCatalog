import { JSONSchema } from "@apidevtools/json-schema-ref-parser";

const datetimeQueryable: JSONSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://example.org/queryables",
  type: "object",
  title: "",
  properties: {
    datetime: {
      description: "Datetime",
      type: "string",
      title: "Acquired",
      format: "date-time",
      pattern: "(\\+00:00|Z)$",
    },
  },
};

export default datetimeQueryable;
