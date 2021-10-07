import { IStacCollection } from "types/stac";
import { toUtcDate } from "utils";
import { rangeFromTemporalExtent } from "../stac";
import {
  CqlBody,
  CqlDate,
  CqlDateRange,
  CqlOperator,
  ICqlExpression,
} from "./types";

export class CqlParser {
  readonly cql: CqlBody;
  readonly collection: IStacCollection;
  readonly expressions: CqlExpressionParser[];

  constructor(cql: CqlBody, collection: IStacCollection) {
    this.cql = cql;
    this.collection = collection;
    this.expressions = this.cql.map(exp => new CqlExpressionParser(exp));
  }

  private formatRange(range: CqlDateRange): CqlDateRange {
    return [toUtcDate(range[0]), toUtcDate(range[1])];
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
        operator: "between",
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

class CqlExpressionParser {
  readonly exp: ICqlExpression;
  readonly operator: CqlOperator;
  readonly property: string;
  readonly value: string | [string, string];

  constructor(exp: ICqlExpression) {
    this.exp = exp;
    const [op, entity] = Object.entries(this.exp)[0];

    this.operator = op as CqlOperator;
    this.property = entity.property;
    this.value = entity.value;
  }
}
