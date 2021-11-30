import {
  CqlPropertyObject,
  CqlDate,
  CqlExpression,
} from "pages/Explore/utils/cql/types";
import {
  dayjs,
  getDayEnd,
  getDayStart,
  toIsoDateString,
  toUtcDateString,
} from "utils";
import { Message, DateMessage } from "./DateMessage";
import { DateRangeState, ValidationState } from "./types";

export const getStartRangeValue = (date: CqlDate) => {
  const d = date.isRange ? date.value[0] : date.value;
  return getDayStart(d, true);
};

export const getEndRangeValue = (date: CqlDate) => {
  const d = date.isRange ? date.value[1] : undefined;
  return getDayEnd(d, true);
};

export const getDateDisplayText = (dateExpression: CqlDate) => {
  return dateExpression.isRange
    ? dateExpression.value.join(" – ")
    : dateExpression.value;
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
      : getDayEnd(dateExpression.max, true),
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
): CqlExpression => {
  const property: CqlPropertyObject = { property: "datetime" };

  // For precision, the date-only string needs to be manipulated to include UTC beginning/end of day
  const start = toIsoDateString(getDayStart(dateRange.start), true);
  const startEndOfDay = toIsoDateString(getDayEnd(dateRange.start), true);

  const end = dateRange.end
    ? toIsoDateString(getDayEnd(dateRange.end), true)
    : undefined;

  switch (operator) {
    case "between":
      if (!dateRange.end) throw new Error("Invalid date range: missing 'end'");

      return {
        anyinteracts: [property, [start, end]],
      };
    case "on":
      return {
        anyinteracts: [property, [start, startEndOfDay]],
      };
    case "after":
      return {
        gte: [property, start],
      };
    case "before":
      return {
        lte: [property, startEndOfDay],
      };
    default:
      throw new Error(`Invalid operator: ${operator} for date range field`);
  }
};
