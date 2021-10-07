import { dayjs } from "utils";
import {
  DateRangeAction,
  DateRangeState,
  ValidationAction,
  ValidationState,
} from "./types";

export const initialValidationState = {
  start: true,
  end: true,
};

export const validationReducer = (
  state: ValidationState,
  action: ValidationAction
) => {
  return { ...state, ...action };
};

export const initialWorkingDateState: DateRangeState = {
  start: dayjs(),
  end: dayjs(),
};

export const dateRangeReducer = (
  state: DateRangeState,
  action: DateRangeAction
): DateRangeState => {
  return { ...state, ...action };
};
