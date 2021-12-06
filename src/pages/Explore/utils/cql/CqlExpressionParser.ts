import React from "react";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { getControlForField } from "./helpers/formFields";

import {
  CqlOperator,
  CqlExpression,
  CqlBetweenExpression,
  ParsedBetweenExpression,
  CqlSinglePreditcate,
  CqlAnyinteractsExpression,
  CqlInExpression,
} from "./types";

export class CqlExpressionParser<T extends string | number> {
  readonly exp: CqlExpression;
  readonly operator: CqlOperator;
  readonly property: string;
  readonly value: T | [T, T] | T[];
  readonly fieldSchema: JSONSchema | undefined;

  constructor(exp: CqlExpression, queryable?: JSONSchema) {
    this.exp = exp;
    const [op] = Object.entries(this.exp)[0];
    this.operator = op as CqlOperator;

    switch (this.operator) {
      case "between":
        const btParsed = this.parseBetween();
        this.property = btParsed.property;
        this.value = btParsed.value;
        break;

      case "lt":
      case "lte":
      case "gt":
      case "gte":
      case "eq":
      case "like":
        const parsed = this.parseSinglePredicate();
        this.property = parsed.property;
        this.value = parsed.value;
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, body] = Object.entries(exp)[0];
    const [field, value] = body;
    return {
      property: field.property,
      value,
    };
  }

  private parseBetween(): ParsedBetweenExpression {
    const exp = this.exp as CqlBetweenExpression<T>;
    return {
      value: [exp.between.lower, exp.between.upper],
      property: exp.between.value.property,
    };
  }

  private parseInPredicate() {
    const exp = this.exp as CqlInExpression<T>;
    return {
      value: exp.in.list,
      property: exp.in.value.property,
    };
  }

  private parseSinglePredicate() {
    const exp = this.exp as CqlSinglePreditcate<T>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, body] = Object.entries(exp)[0];
    const [field, value] = body;
    return {
      property: field.property,
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
