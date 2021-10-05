type CqlOperator =
  | "eq"
  | "gte"
  | "gt"
  | "lte"
  | "lte"
  | "between"
  | "like"
  | "anyinteracts"
  | "intersects";

type CqlPropertyObject = { property: string };

export interface ICqlExpression {
  eq: [CqlPropertyObject, number | string];
  gte: [CqlPropertyObject, number | string];
  gt: [CqlPropertyObject, number | string];
  lte: [CqlPropertyObject, number | string];
  lt: [CqlPropertyObject, number | string];
  between: [CqlPropertyObject, number[] | string[]];
  like: [CqlPropertyObject, string];
  anyinteracts: [CqlPropertyObject, string[]];
  intersects: any;
}

export type CqlBody = ICqlExpression[];

// Represent parsed dates
export type CqlDateSingle = string;
export type CqlDateRange = [string, string];
export type CqlDate =
  | {
      operator: CqlOperator;
      isRange: false;
      value: CqlDateSingle;
      min: CqlDateSingle;
      max: CqlDateSingle;
    }
  | {
      operator: CqlOperator;
      isRange: true;
      value: CqlDateRange;
      min: CqlDateSingle;
      max: CqlDateSingle;
    };
