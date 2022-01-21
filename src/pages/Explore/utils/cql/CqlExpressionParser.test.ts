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
    op: "=",
    args: [{ property: "eo:cloud_cover" }, 10],
  };
  const exp = new CqlExpressionParser(cql, testQueryable);

  expect(exp.value).toEqual(10);
  expect(exp.property).toEqual("eo:cloud_cover");
  expect(exp.operator).toEqual("=");
});

it("parses equal text expression", () => {
  const cql: CqlEqualExpression<string> = {
    op: "=",
    args: [{ property: "sat:orbit_state" }, "ascending"],
  };
  const exp = new CqlExpressionParser(cql, testQueryable);

  expect(exp.value).toEqual("ascending");
  expect(exp.property).toEqual("sat:orbit_state");
  expect(exp.operator).toEqual("=");
});

it("parses gt expression", () => {
  const cql: CqlGtExpression<number> = {
    op: ">",
    args: [{ property: "eo:cloud_cover" }, 10],
  };
  const exp = new CqlExpressionParser(cql, testQueryable);

  expect(exp.value).toEqual(10);
  expect(exp.property).toEqual("eo:cloud_cover");
  expect(exp.operator).toEqual(">");
});

it("parses gte expression", () => {
  const cql: CqlGteExpression<number> = {
    op: ">=",
    args: [{ property: "eo:cloud_cover" }, 10],
  };
  const exp = new CqlExpressionParser(cql, testQueryable);

  expect(exp.value).toEqual(10);
  expect(exp.property).toEqual("eo:cloud_cover");
  expect(exp.operator).toEqual(">=");
});

it("parses lt expression", () => {
  const cql: CqlLtExpression<number> = {
    op: "<",
    args: [{ property: "eo:cloud_cover" }, 10],
  };
  const exp = new CqlExpressionParser(cql, testQueryable);

  expect(exp.value).toEqual(10);
  expect(exp.property).toEqual("eo:cloud_cover");
  expect(exp.operator).toEqual("<");
});

it("parses lte expression", () => {
  const cql: CqlLteExpression<number> = {
    op: "<=",
    args: [{ property: "eo:cloud_cover" }, 10],
  };
  const exp = new CqlExpressionParser(cql, testQueryable);

  expect(exp.value).toEqual(10);
  expect(exp.property).toEqual("eo:cloud_cover");
  expect(exp.operator).toEqual("<=");
});

it("parses between expression", () => {
  const cql: CqlBetweenExpression = {
    op: "between",
    args: [{ property: "eo:cloud_cover" }, [10, 20]],
  };
  const exp = new CqlExpressionParser(cql, testQueryable);

  expect(exp.value).toEqual([10, 20]);
  expect(exp.property).toEqual("eo:cloud_cover");
  expect(exp.operator).toEqual("between");
});

it("parses in expression", () => {
  const cql: CqlInExpression<string> = {
    op: "in",
    args: [{ property: "sat:orbit_state" }, ["ascending", "descending"]],
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
