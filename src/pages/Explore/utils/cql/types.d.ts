type CqlOperator =
  | "eq"
  | "gte"
  | "gt"
  | "lte"
  | "lt"
  | "between"
  | "like"
  | "anyinteracts"
  | "intersects";

type CqlPropertyObject = { property: string };
type CqlBetweenPredicate = {
  value: CqlPropertyObject;
  lower: number;
  upper: number;
};

export type ICqlExpression =
  | { eq: [CqlPropertyObject, number | string] }
  | { gte: [CqlPropertyObject, number | string] }
  | { gt: [CqlPropertyObject, number | string] }
  | { lte: [CqlPropertyObject, number | string] }
  | { lt: [CqlPropertyObject, number | string] }
  | { like: [CqlPropertyObject, string] }
  | { anyinteracts: [CqlPropertyObject, string[]] }
  | { between: CqlBetweenPredicate }
  | { intersects: [CqlPropertyObject, GeoJSON] };

export type ICqlExpressionList = ICqlExpression[] | [];

// Represent parsed dates
export type CqlDateSingle = string;
export type CqlDateRange = [string, string];
interface ICqlDatePart {
  operator: CqlOperator;
  min: CqlDateSingle;
  max: CqlDateSingle;
}

type CqlRangeableDate =
  | {
      isRange: false;
      value: CqlDateSingle;
    }
  | {
      isRange: true;
      value: CqlDateRange;
    };

export type CqlDate = CqlRangeableDate & ICqlDatePart;
