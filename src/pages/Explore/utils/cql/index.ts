import React from "react";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { IStacCollection } from "types/stac";
import { toUtcDate } from "utils";
import { rangeFromTemporalExtent } from "../stac";
import { getControlForField } from "./helpers";

import {
  CqlDate,
  CqlDateRange,
  CqlOperator,
  ICqlExpression,
  ICqlExpressionList,
} from "./types";

type getExpressionOptions = {
  omit: string[];
};
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
    this.expressions = this.cql.map(exp => {
      return new CqlExpressionParser(exp, queryable);
    });
    this.queryable = queryable;
  }

  private formatRange(range: CqlDateRange): CqlDateRange {
    return [toUtcDate(range[0]), toUtcDate(range[1])];
  }

  getExpressions({ omit }: getExpressionOptions): CqlExpressionParser[] {
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
  readonly fieldSchema: JSONSchema | undefined;

  constructor(exp: ICqlExpression, queryable?: JSONSchema) {
    this.exp = exp;
    const [op, entity] = Object.entries(this.exp)[0];
    const [attr, value] = entity;

    this.operator = op as CqlOperator;
    this.property = attr.property;
    this.value = value;
    this.fieldSchema = this.queryableFieldDefinition(this.property, queryable);
  }

  private queryableFieldDefinition(
    property: string,
    queryable: JSONSchema | undefined
  ): JSONSchema | undefined {
    const fieldSchema = queryable?.properties?.[property];
    if (typeof fieldSchema !== "boolean") {
      return fieldSchema;
    }
    console.warn("Unexpected property schema: ", property);
  }

  get control(): React.ReactNode {
    return getControlForField(this);
  }
}
