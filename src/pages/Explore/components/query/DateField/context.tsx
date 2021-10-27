import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DateRangeState, ValidationAction, ValidationState } from "./types";
import { initialValidationState } from "./state";

export interface IDateFieldContext {
  validMinDate: Dayjs;
  validMaxDate: Dayjs;
  workingDates: DateRangeState | null;
  validationState: ValidationState;
  setValidation:
    | React.Dispatch<ValidationAction>
    | ((arg: ValidationAction) => void);
}

export const DateFieldContext = React.createContext<IDateFieldContext>({
  validMinDate: dayjs(),
  validMaxDate: dayjs(),
  workingDates: null,
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
