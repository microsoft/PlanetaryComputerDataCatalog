import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { IStacCollection } from "types/stac";
import { rangeFromTemporalExtent } from "../stac";
import { formatDatetime, getDayEnd, getDayStart, parseDatetime } from "../time";
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
    const start = parseDatetime(range[0]);
    const end = parseDatetime(range[1]);

    // If the range is the same exact datetime, and at the begining of the day,
    // expand it to a full day. This is the case of some single-day collections.
    if (start.isSame(end) && start.isSame(getDayStart(start))) {
      return [formatDatetime(start), formatDatetime(getDayEnd(end))];
    }

    return [formatDatetime(start), formatDatetime(end)];
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
          value: formatDatetime(implicitDate),
          isRange: false,
          ...collectionRange,
        };
      }
    }

    return {
      operator: date.operator,
      value: formatDatetime(date.value),
      isRange: false,
      ...collectionRange,
    };
  }
}
