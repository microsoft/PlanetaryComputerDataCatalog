import { CqlParser } from ".";
import { IStacCollection } from "types/stac";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { CqlAnyinteractsExpression, ICqlExpressionList } from "./types";
import { dayjs } from "utils";

const collection: Partial<IStacCollection> = {
  id: "sentinel-2-l2a",
  extent: {
    temporal: {
      interval: [["2015-06-27T10:25:31.456000Z", null]],
    },
    spatial: { bbox: [[0, 0, 0, 0]] },
  },
};

export const testQueryable: JSONSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    id: {
      title: "Item ID",
      description: "Item identifier",
      $ref: "https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/item.json#/definitions/core/allOf/2/properties/id",
    },
    datetime: {
      description: "Datetime",
      type: "string",
      title: "Acquired",
      format: "date-time",
      pattern: "(\\+00:00|Z)$",
    },
    "eo:cloud_cover": {
      $ref: "https://stac-extensions.github.io/eo/v1.0.0/schema.json#/definitions/fields/properties/eo:cloud_cover",
    },
    "sat:orbit_state": {
      $ref: "https://stac-extensions.github.io/sat/v1.0.0/schema.json#/definitions/fields/properties/sat:orbit_state",
    },
  },
};

it("parses an empty expression list", () => {
  const cql: ICqlExpressionList = [];
  const p = new CqlParser(cql, collection as IStacCollection, testQueryable);

  expect(p).toBeTruthy();
});

it("parses an empty expression list with the default collection dates", () => {
  const cql: ICqlExpressionList = [];
  const p = new CqlParser(cql, collection as IStacCollection, testQueryable);
  const dt = p.dateValue;

  expect(dt.isRange).toBeTruthy();
  expect(dt.min).toEqual(collection.extent?.temporal.interval[0][0]);
  expect(dayjs.utc(dt.max).isSame(dayjs(), "year")).toBeTruthy();
  expect(dt.operator).toEqual("anyinteracts");
});

it("parses same day anyinteracts as a non-range value", () => {
  const dcql: CqlAnyinteractsExpression<string> = {
    op: "anyinteracts",
    args: [
      { property: "datetime" },
      ["2021-01-01T00:00:00Z", "2021-01-01T23:59:59Z"],
    ],
  };
  const cql: ICqlExpressionList = [dcql];
  const p = new CqlParser(cql, collection as IStacCollection, testQueryable);
  const dt = p.dateValue;

  expect(dt.isRange).toBeFalsy();
});

it("parses multi day anyinteracts as a range value", () => {
  const dcql: CqlAnyinteractsExpression<string> = {
    op: "anyinteracts",
    args: [
      { property: "datetime" },
      ["2021-01-01T00:00:00Z", "2021-02-01T23:59:59Z"],
    ],
  };
  const cql: ICqlExpressionList = [dcql];
  const p = new CqlParser(cql, collection as IStacCollection, testQueryable);
  const dt = p.dateValue;

  expect(dt.isRange).toBeTruthy();
});
