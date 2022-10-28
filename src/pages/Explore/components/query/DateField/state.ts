import { parseDatetime } from "pages/Explore/utils/time";
import {
  DateRangeAction,
  DateRangeState,
  ValidationAction,
  ValidationState,
} from "./types";

export const initialValidationState: ValidationState = {
  start: true,
  startError: null,
  end: true,
  endError: null,
};

export const validationReducer = (
  state: ValidationState,
  action: ValidationAction
) => {
  return { ...state, ...action };
};

const now = parseDatetime(new Date());
export const initialWorkingDateState: DateRangeState = {
  start: now,
  end: now,
};

export const dateRangeReducer = (
  state: DateRangeState,
  action: DateRangeAction
): DateRangeState => {
  return { ...state, ...action };
};
