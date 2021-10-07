import { CqlDate } from "pages/Explore/utils/cql/types";
import { getDayStart } from "utils";
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
  const datesChanged =
    !initialDates.start.isSame(workingDates.start) ||
    !initialDates.end.isSame(workingDates.end);

  return validDates && datesChanged;
};
