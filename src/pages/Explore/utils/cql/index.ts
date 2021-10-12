import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { IStacCollection } from "types/stac";
import { toUtcDate } from "utils";
import { rangeFromTemporalExtent } from "../stac";
import {
  CqlDate,
  CqlDateRange,
  CqlOperator,
  ICqlExpression,
  ICqlExpressionList,
} from "./types";

export class CqlParser {
  readonly cql: ICqlExpressionList;
  readonly collection: IStacCollection;
  readonly expressions: CqlExpressionParser[];
  readonly queryable: JSONSchema;

  constructor(
    cql: ICqlExpressionList,
    collection: IStacCollection,
    queryable: JSONSchema
  ) {
    this.cql = cql;
    this.collection = collection;
    this.expressions = this.cql.map(exp => new CqlExpressionParser(exp));
    this.queryable = queryable;
  }

  private formatRange(range: CqlDateRange): CqlDateRange {
    return [toUtcDate(range[0]), toUtcDate(range[1])];
  }

  getExpressions(omit: string[]): CqlExpressionParser[] {
    console.log(this.queryable.properties);
    return this.expressions.filter(exp => !omit.includes(exp.property));
  }

  get dateValue(): CqlDate | undefined {
    const date = this.expressions.find(exp => exp.property === "datetime");

    const [min, max] = rangeFromTemporalExtent(
      this.collection.extent.temporal.interval
    );
    const collectionRange = { min, max };

    // If there is no date, return the max date range
    if (!date) {
      return {
        operator: "anyinteracts",
        isRange: true,
        value: this.formatRange([min, max]),
        ...collectionRange,
      };
    }

    if (Array.isArray(date.value)) {
      return {
        operator: date.operator,
        value: this.formatRange(date.value),
        isRange: true,
        ...collectionRange,
      };
    }

    return {
      operator: date.operator,
      value: toUtcDate(date.value),
      isRange: false,
      ...collectionRange,
    };
  }
}

export class CqlExpressionParser {
  readonly exp: ICqlExpression;
  readonly operator: CqlOperator;
  readonly property: string;
  readonly value: string | [string, string];

  constructor(exp: ICqlExpression) {
    this.exp = exp;
    const [op, entity] = Object.entries(this.exp)[0];
    const [attr, value] = entity;

    this.operator = op as CqlOperator;
    this.property = attr.property;
    this.value = value;
  }
}
