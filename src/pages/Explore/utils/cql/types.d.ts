type CqlOperator =
  | "="
  | ">"
  | ">="
  | "<"
  | "<="
  | "in"
  | "between"
  | "like"
  | "anyinteracts"
  | "intersects";

type CqlPropertyObject = { property: string };
type CqlIntervalValue = { interval: [string, string] };
export type CqlTimestampValue = { timestamp: string };

export type CqlEqualExpression<T> = { op: "="; args: [CqlPropertyObject, T] };
export type CqlGteExpression<T> = { op: ">="; args: [CqlPropertyObject, T] };
export type CqlGtExpression<T> = { op: ">"; args: [CqlPropertyObject, T] };
export type CqlLteExpression<T> = { op: "<="; args: [CqlPropertyObject, T] };
export type CqlLtExpression<T> = { op: "<"; args: [CqlPropertyObject, T] };
export type CqlBetweenExpression = {
  op: "between";
  args: [CqlPropertyObject, [number, number]];
};
export type CqlInExpression<T> = { op: "in"; args: [CqlPropertyObject, T[]] };
export type CqlAnyinteractsExpression<T> = {
  op: "anyinteracts";
  args: [CqlPropertyObject, CqlIntervalValue<T>];
};
export type CqlLikeExpression = {
  op: "like";
  args: [CqlPropertyObject, string];
};
export type CqlIntersectsExpression<GeoJSON> = {
  op: "s_intersects";
  args: [CqlPropertyObject, GeoJSON];
};

type CqlSinglePredicate<T> =
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
  | CqlInExpression
  | CqlLikeExpression
  | CqlIntersectsExpression;

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
