import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { ValidationAction } from "./types";

interface IDateFieldContext {
  validMinDate: Dayjs;
  validMaxDate: Dayjs;
  setValidation:
    | React.Dispatch<ValidationAction>
    | ((arg: ValidationAction) => void);
}

export const DateFieldContext = React.createContext<IDateFieldContext>({
  validMinDate: dayjs(),
  validMaxDate: dayjs(),
  setValidation: () => {},
});

export const DateFieldProvider: React.FC<{ state: IDateFieldContext }> = ({
  state,
  children,
}) => {
  return (
    <DateFieldContext.Provider value={state}>{children}</DateFieldContext.Provider>
  );
};
