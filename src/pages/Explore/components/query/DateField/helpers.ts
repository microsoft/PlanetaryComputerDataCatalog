import {
  CqlPropertyObject,
  CqlDate,
  CqlExpression,
} from "pages/Explore/utils/cql/types";
import { getDayStart, toDateString } from "utils";
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
  workingDates: DateRangeState
) => {
  const validDates = validationState.start && validationState.end;
  const startDateChanged = !initialDates.start.isSame(workingDates.start);
  const endDateChanged =
    (!initialDates.end && !workingDates.end) ||
    Boolean(initialDates.end && !initialDates.end.isSame(workingDates.end));

  // Valid if the dates are valid and either the start date or end date has changed
  return validDates && (startDateChanged || endDateChanged);
};

export const toDateRange = (dateExpression: CqlDate): DateRangeState => {
  return {
    start: getStartRangeValue(dateExpression),
    end: dateExpression.isRange ? getEndRangeValue(dateExpression) : null,
  };
};

export const toCqlExpression = (dateRange: DateRangeState): CqlExpression => {
  const property: CqlPropertyObject = { property: "datetime" };

  if (dateRange.end) {
    const value = [toDateString(dateRange.start), toDateString(dateRange.end)];
    return {
      anyinteracts: [property, value],
    };
  }

  return {
    eq: [property, toDateString(dateRange.start)],
  };
};
