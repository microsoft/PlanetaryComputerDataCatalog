import { Dayjs } from "dayjs";
import {
  CqlPropertyObject,
  CqlDate,
  CqlAnyinteractsExpression,
  CqlGteExpression,
  CqlLteExpression,
  CqlTimestampValue,
} from "pages/Explore/utils/cql/types";
import { dayjs, getDayEnd, toIsoDateString, toUtcDateString } from "utils";
import { Message, DateMessage } from "./DateMessage";
import { DateRangeState, ValidationState } from "./types";

export const getStartRangeValue = (date: CqlDate): Dayjs => {
  const d = date.isRange ? date.value[0] : date.value;
  return dayjs(d).utc();
};

export const getEndRangeValue = (date: CqlDate): Dayjs => {
  const d = date.isRange ? date.value[1] : undefined;
  return dayjs(d).utc();
};

export const getDateDisplayText = (dateExpression: CqlDate) => {
  return dateExpression.isRange
    ? dateExpression.value.join(" – ")
    : dateExpression.value;
};

export const isSingleDayRange = (initialDates: DateRangeState) => {
  return initialDates.start.isSame(initialDates.end, "day");
};

export const isValidToApply = (
  validationState: ValidationState,
  initialDates: DateRangeState,
  workingDates: DateRangeState,
  initialOperator: string,
  workingOperator: string
) => {
  const validDates = validationState.start && validationState.end;
  const startDateChanged = !initialDates.start.isSame(workingDates.start, "day");
  const endDateChanged =
    (!initialDates.end && !workingDates.end) ||
    Boolean(initialDates.end && !initialDates.end.isSame(workingDates.end, "day"));

  // Valid if the dates are valid and either the start date or end date has changed
  const dateChanged = startDateChanged || endDateChanged;
  const operatorChanged = initialOperator !== workingOperator;

  return validDates && (dateChanged || operatorChanged);
};

export const toDateRange = (dateExpression: CqlDate): DateRangeState => {
  return {
    start: getStartRangeValue(dateExpression),
    end: dateExpression.isRange
      ? getEndRangeValue(dateExpression)
      : dayjs(dateExpression.max),
  };
};

export const getValidDateText = (dateExpression: CqlDate, isRange: boolean) => {
  const displayMin = (
    <DateMessage>{toUtcDateString(dateExpression.min)}</DateMessage>
  );
  const displayMax = (
    <DateMessage>{toUtcDateString(dateExpression.max)}</DateMessage>
  );

  const min = dayjs.utc(dateExpression.min);
  const max = dayjs.utc(dateExpression.max);
  const sameDay = min.isSame(max, "day");

  if (sameDay) {
    return <Message>Date only valid on {displayMin}</Message>;
  }

  return isRange ? (
    <Message>
      Valid between {displayMin} and {displayMax}
    </Message>
  ) : (
    <Message>
      Valid {displayMin} to {displayMax}
    </Message>
  );
};

export const toCqlExpression = (
  dateRange: DateRangeState,
  operator: string
):
  | CqlAnyinteractsExpression<string>
  | CqlGteExpression<string | CqlTimestampValue>
  | CqlLteExpression<string | CqlTimestampValue> => {
  const property: CqlPropertyObject = { property: "datetime" };

  const start = toIsoDateString(dateRange.start.utc(), true);
  const startEndOfDay = toIsoDateString(getDayEnd(dateRange.start.utc()), true);

  const end = dateRange.end ? toIsoDateString(dateRange.end.utc(), true) : undefined;

  switch (operator) {
    case "between":
      if (end === undefined) throw new Error("Invalid date range: missing 'end'");

      return {
        op: "anyinteracts",
        args: [property, { interval: [start, end] }],
      };
    case "on":
      return {
        op: "anyinteracts",
        args: [property, { interval: [start, startEndOfDay] }],
      };
    case "after":
      return {
        op: ">=",
        args: [property, { timestamp: start }],
      };
    case "before":
      return {
        op: "<=",
        args: [property, { timestamp: start }],
      };
    default:
      throw new Error(`Invalid operator: ${operator} for date range field`);
  }
};
