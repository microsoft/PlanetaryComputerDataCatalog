import {
  CqlPropertyObject,
  CqlDate,
  CqlExpression,
} from "pages/Explore/utils/cql/types";
import { getDayEnd, getDayStart, toIsoDateString } from "utils";
import { DateRangeState, ValidationState } from "./types";

export const getStartRangeValue = (d: CqlDate) => {
  return getDayStart(d.isRange ? d.value[0] : d.value);
};

export const getEndRangeValue = (d: CqlDate) => {
  return getDayStart(d.isRange ? d.value[1] : undefined);
};

export const getDateDisplayText = (dateExpression: CqlDate) => {
  return dateExpression.isRange
    ? dateExpression.value.join(" - ")
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
  const startDateChanged = !initialDates.start.isSame(workingDates.start);
  const endDateChanged =
    (!initialDates.end && !workingDates.end) ||
    Boolean(initialDates.end && !initialDates.end.isSame(workingDates.end));

  // Valid if the dates are valid and either the start date or end date has changed
  const dateChanged = startDateChanged || endDateChanged;
  const operatorChanged = initialOperator !== workingOperator;

  return validDates && (dateChanged || operatorChanged);
};

export const toDateRange = (dateExpression: CqlDate): DateRangeState => {
  return {
    start: getStartRangeValue(dateExpression),
    end: dateExpression.isRange ? getEndRangeValue(dateExpression) : null,
  };
};

export const toCqlExpression = (
  dateRange: DateRangeState,
  operator: string
): CqlExpression => {
  const property: CqlPropertyObject = { property: "datetime" };

  // For precision, the date-only string needs to be manipulated to include UTC begining/end of day
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
        gt: [property, startEndOfDay],
      };
    case "before":
      return {
        lt: [property, start],
      };
    default:
      throw new Error(`Invalid operator: ${operator} for date range field`);
  }
};
