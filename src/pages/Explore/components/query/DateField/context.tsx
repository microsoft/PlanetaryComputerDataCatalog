import React from "react";
import { Dayjs } from "dayjs";
import { DateRangeState, ValidationAction, ValidationState } from "./types";
import { initialValidationState } from "./state";
import { parseDatetime } from "pages/Explore/utils/time";

export interface IDateFieldContext {
  validMinDate: Dayjs;
  validMaxDate: Dayjs;
  workingDates: DateRangeState;
  validationState: ValidationState;
  setValidation:
    | React.Dispatch<ValidationAction>
    | ((arg: ValidationAction) => void);
}

const now = parseDatetime(new Date());
export const DateFieldContext = React.createContext<IDateFieldContext>({
  validMinDate: now,
  validMaxDate: now,
  workingDates: { start: now, end: null },
  setValidation: () => {},
  validationState: initialValidationState,
});

export const DateFieldProvider: React.FC<{ state: IDateFieldContext }> = ({
  state,
  children,
}) => {
  return (
    <DateFieldContext.Provider value={state}>{children}</DateFieldContext.Provider>
  );
};
