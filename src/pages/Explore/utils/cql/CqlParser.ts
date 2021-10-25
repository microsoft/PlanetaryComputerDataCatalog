import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { IStacCollection } from "types/stac";
import { toUtcDate } from "utils";
import { rangeFromTemporalExtent } from "../stac";
import { CqlExpressionParser } from "./CqlExpressionParser";
import { rangeIsOnSameDay } from "./helpers";

import { CqlDate, CqlDateRange, ICqlExpressionList } from "./types";

type getExpressionOptions = {
  omit: string[];
};
export class CqlParser {
  readonly cql: ICqlExpressionList;
  readonly collection: IStacCollection;
  readonly expressions: CqlExpressionParser<string | number>[];
  readonly queryable: JSONSchema;

  constructor(
    cql: ICqlExpressionList,
    collection: IStacCollection,
    queryable: JSONSchema
  ) {
    this.cql = cql;
    this.collection = collection;
    this.expressions = this.cql.map(exp => {
      return new CqlExpressionParser(exp, queryable);
    });
    this.queryable = queryable;
  }

  private formatRange(range: CqlDateRange): CqlDateRange {
    return [toUtcDate(range[0]), toUtcDate(range[1])];
  }

  getExpressions({
    omit,
  }: getExpressionOptions): CqlExpressionParser<string | number>[] {
    return this.expressions.filter(exp => !omit.includes(exp.property));
  }

  get dateValue(): CqlDate {
    const date = this.expressions.find(
      exp => exp.property === "datetime"
    ) as CqlExpressionParser<string>;

    const [min, max] = rangeFromTemporalExtent(
      this.collection.extent.temporal.interval
    );
    const collectionRange = { min, max };
    const isRange = !rangeIsOnSameDay(date?.value);

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
      if (date.value.length !== 2) {
        throw new Error("Date range value must contain exactly two dates");
      }

      if (isRange) {
        const [min, max] = date.value;
        return {
          operator: date.operator,
          value: this.formatRange([min, max]),
          isRange: true,
          ...collectionRange,
        };
      } else {
        const implicitDate = date.value[0];
        return {
          operator: date.operator,
          value: toUtcDate(implicitDate),
          isRange: false,
          ...collectionRange,
        };
      }
    }

    return {
      operator: date.operator,
      value: toUtcDate(date.value),
      isRange: false,
      ...collectionRange,
    };
  }
}
