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
type CqlBetweenPredicate<T> = {
  value: CqlPropertyObject;
  lower: T;
  upper: T;
};

export type CqlEqualExpression<T> = { eq: [CqlPropertyObject, T] };
export type CqlGteExpression<T> = { gte: [CqlPropertyObject, T] };
export type CqlGtExpression<T> = { gt: [CqlPropertyObject, T] };
export type CqlLteExpression<T> = { lte: [CqlPropertyObject, T] };
export type CqlLtExpression<T> = { lt: [CqlPropertyObject, T] };
export type CqlBetweenExpression<T> = { between: CqlBetweenPredicate<T> };
export type CqlAnyinteractsExpression<T> = {
  anyinteracts: [CqlPropertyObject, [T, T]];
};

type CqlSinglePreditcate<T> =
  | CqlEqualExpression<T>
  | CqlGteExpression<T>
  | CqlGtExpression<T>
  | CqlLteExpression<T>
  | CqlLtExpression<T>;

export type CqlExpression =
  | CqlEqualExpression
  | CqlGteExpression
  | CqlGtExpression
  | CqlLteExpression
  | CqlLtExpression
  | CqlBetweenExpression
  | CqlAnyinteractsExpression
  | { like: [CqlPropertyObject, string] }
  | { intersects: [CqlPropertyObject, GeoJSON] };

export type ICqlExpressionList = CqlExpression[] | [];

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

export type ParsedBetweenExpression = { property: string; value: [T, T] };
