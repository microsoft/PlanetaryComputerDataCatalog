import React from "react";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { getControlForField } from "./helpers/formFields";

import {
  CqlOperator,
  CqlExpression,
  CqlBetweenExpression,
  ParsedBetweenExpression,
  CqlSinglePredicate,
  CqlAnyinteractsExpression,
  CqlInExpression,
} from "./types";
import { CQL_PROP_IDX, CQL_VALS_IDX } from "../constants";

export class CqlExpressionParser<T extends string | number> {
  readonly exp: CqlExpression;
  readonly operator: CqlOperator;
  readonly property: string;
  readonly value: T | [T, T] | T[];
  readonly fieldSchema: JSONSchema | undefined;

  constructor(exp: CqlExpression, queryable?: JSONSchema) {
    this.exp = exp;
    this.operator = this.exp.op;

    switch (this.operator) {
      case "<":
      case "<=":
      case ">":
      case ">=":
      case "=":
      case "like":
        const parsed = this.parseSinglePredicate();
        this.property = parsed.property;
        this.value = parsed.value;
        break;

      case "between":
        const btParsed = this.parseBetween();
        this.property = btParsed.property;
        this.value = btParsed.value;
        break;

      case "in":
        const inParsed = this.parseInPredicate();
        this.property = inParsed.property;
        this.value = inParsed.value;
        break;

      case "anyinteracts":
        const aiParsed = this.parseAnyinteracts();
        this.property = aiParsed.property;
        this.value = aiParsed.value;
        break;

      default:
        throw new Error(`Unsupported operator: ${this.operator}`);
    }

    this.fieldSchema = this.queryableFieldDefinition(this.property, queryable);
  }

  private parseAnyinteracts() {
    const exp = this.exp as CqlAnyinteractsExpression<T>;
    const property = exp.args[CQL_PROP_IDX].property;
    const value = exp.args[CQL_VALS_IDX].interval;

    return {
      property: property,
      value,
    };
  }

  private parseBetween(): ParsedBetweenExpression {
    const exp = this.exp as CqlBetweenExpression;
    return {
      property: exp.args[CQL_PROP_IDX].property,
      value: exp.args[CQL_VALS_IDX],
    };
  }

  private parseInPredicate() {
    const exp = this.exp as CqlInExpression<T>;
    return {
      property: exp.args[CQL_PROP_IDX].property,
      value: exp.args[CQL_VALS_IDX],
    };
  }

  private parseSinglePredicate() {
    const exp = this.exp as CqlSinglePredicate<T>;
    const property = exp.args[CQL_PROP_IDX].property;

    const value =
      property === "datetime"
        ? //@ts-ignore
          exp.args[CQL_VALS_IDX].timestamp
        : exp.args[CQL_VALS_IDX];

    return {
      property: property,
      value,
    };
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
