import { CqlExpressionParser } from ".";
import { testQueryable } from "./CqlParser.test";
import {
  CqlBetweenExpression,
  CqlEqualExpression,
  CqlGteExpression,
  CqlGtExpression,
  CqlInExpression,
  CqlLteExpression,
  CqlLtExpression,
} from "./types";

it("parses equal numeric expression", () => {
  const cql: CqlEqualExpression<number> = {
    eq: [{ property: "eo:cloud_cover" }, 10],
  };
  const exp = new CqlExpressionParser(cql, testQueryable);

  expect(exp.value).toEqual(10);
  expect(exp.property).toEqual("eo:cloud_cover");
  expect(exp.operator).toEqual("eq");
});

it("parses equal text expression", () => {
  const cql: CqlEqualExpression<string> = {
    eq: [{ property: "sat:orbit_state" }, "ascending"],
  };
  const exp = new CqlExpressionParser(cql, testQueryable);

  expect(exp.value).toEqual("ascending");
  expect(exp.property).toEqual("sat:orbit_state");
  expect(exp.operator).toEqual("eq");
});

it("parses gt expression", () => {
  const cql: CqlGtExpression<number> = {
    gt: [{ property: "eo:cloud_cover" }, 10],
  };
  const exp = new CqlExpressionParser(cql, testQueryable);

  expect(exp.value).toEqual(10);
  expect(exp.property).toEqual("eo:cloud_cover");
  expect(exp.operator).toEqual("gt");
});

it("parses gte expression", () => {
  const cql: CqlGteExpression<number> = {
    gte: [{ property: "eo:cloud_cover" }, 10],
  };
  const exp = new CqlExpressionParser(cql, testQueryable);

  expect(exp.value).toEqual(10);
  expect(exp.property).toEqual("eo:cloud_cover");
  expect(exp.operator).toEqual("gte");
});

it("parses lt expression", () => {
  const cql: CqlLtExpression<number> = {
    lt: [{ property: "eo:cloud_cover" }, 10],
  };
  const exp = new CqlExpressionParser(cql, testQueryable);

  expect(exp.value).toEqual(10);
  expect(exp.property).toEqual("eo:cloud_cover");
  expect(exp.operator).toEqual("lt");
});

it("parses lte expression", () => {
  const cql: CqlLteExpression<number> = {
    lte: [{ property: "eo:cloud_cover" }, 10],
  };
  const exp = new CqlExpressionParser(cql, testQueryable);

  expect(exp.value).toEqual(10);
  expect(exp.property).toEqual("eo:cloud_cover");
  expect(exp.operator).toEqual("lte");
});

it("parses between expression", () => {
  const cql: CqlBetweenExpression<number> = {
    between: { value: { property: "eo:cloud_cover" }, lower: 10, upper: 20 },
  };
  const exp = new CqlExpressionParser(cql, testQueryable);

  expect(exp.value).toEqual([10, 20]);
  expect(exp.property).toEqual("eo:cloud_cover");
  expect(exp.operator).toEqual("between");
});

it("parses in expression", () => {
  const cql: CqlInExpression<string> = {
    in: {
      value: { property: "sat:orbit_state" },
      list: ["ascending", "descending"],
    },
  };
  const exp = new CqlExpressionParser(cql, testQueryable);

  expect(exp.value).toEqual(["ascending", "descending"]);
  expect(exp.property).toEqual("sat:orbit_state");
  expect(exp.operator).toEqual("in");
});

it("throws on unknown operator", () => {
  const cql = {
    foo: [{ property: "sat:orbit_state" }, "ascending"],
  } as unknown;

  expect(() => {
    new CqlExpressionParser(cql, testQueryable);
  }).toThrowError();
});
