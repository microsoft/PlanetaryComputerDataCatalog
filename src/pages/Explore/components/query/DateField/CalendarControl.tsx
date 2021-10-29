import { useEffect, useContext, useState } from "react";
import { Calendar, ITextFieldStyles, MaskedTextField, Stack } from "@fluentui/react";
import { dayjs, toAbsoluteDate, toDateString, toUtcDateString } from "utils";
import { DateFieldContext } from "./context";
import { DateRangeAction, RangeType } from "./types";

interface CalendarControlProps {
  label: string;
  rangeType: RangeType;
  operator: string;
  onSelectDate: React.Dispatch<DateRangeAction>;
}

const CalendarControl = ({
  label,
  rangeType,
  operator,
  onSelectDate,
}: CalendarControlProps) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [invalidDate, setInvalidDate] = useState<Date>();
  const {
    validMaxDate,
    validMinDate,
    workingDates,
    validationState,
    setValidation,
    signalApply,
  } = useContext(DateFieldContext);

  const date = workingDates[rangeType];

  const handleSelectDate = (newDate: Date) => {
    setDateValidation(newDate);
    onSelectDate({ [rangeType]: dayjs(newDate) });
  };

  const handleTextChange = (
    _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) => {
    const newDay = dayjs(newValue);
    const newDate = newDay.toDate();

    // Check valid date format and if it's in range - only set working date if so
    const valid = newDay.isValid() && setDateValidation(newDate);
    valid && handleSelectDate(newDate);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      signalApply();
    }
  };

  const getErrorMessage = (value: Date | string) => {
    const day = dayjs(value);
    if (!day.isValid()) return "Invalid date, use MM/DD/YYYY";

    if (day.isBefore(validMinDate))
      return `Date must be after ${toDateString(validMinDate.subtract(1, "day"))}`;

    if (day.isAfter(validMaxDate))
      return `Date must be before ${toDateString(validMaxDate.add(1, "day"))}`;

    // Validate date ranges to be start <= end
    if (operator === "between") {
      if (
        rangeType === "start" &&
        workingDates?.end &&
        day.isAfter(workingDates.end)
      ) {
        return `Start date must be before end date (${toDateString(
          workingDates.end
        )})`;
      } else if (
        rangeType === "end" &&
        workingDates?.start &&
        day.isBefore(workingDates.start)
      ) {
        return `End date must be after start date (${toDateString(
          workingDates.start
        )})`;
      }
    }
    return "";
  };

  const setDateValidation = (value: Date | undefined) => {
    if (!value) return false;

    // The calendar control determines validation state by the presence or absence of a
    // string which is also used as a validation message.
    const err = getErrorMessage(value);
    setErrorMessage(err);

    // Dispatch to the parent context using the rangeType key provided
    const validation = { [rangeType]: !Boolean(err) };
    if (validation[rangeType] !== validationState[rangeType]) {
      setValidation(validation);
    }

    // Track the invalid date. It may not be *currently* valid compared to the other date in the range.
    // When the other date changes, we'll check this invalid date and it could become valid will need to
    // be applied to the working dates.
    if (err) {
      setInvalidDate(value);
    } else {
      setInvalidDate(undefined);
    }

    const hasError = Boolean(err);
    return !hasError;
  };

  // Cross validate date ranges - when rendering, the current invalid date may
  // have become valid due to changes in the other date range value.
  useEffect(() => {
    if (errorMessage && operator === "between" && invalidDate) {
      // Check the validity of the previous invalid date
      const valid = setDateValidation(invalidDate);

      // If it's now valid, use it as the selected date
      if (valid) {
        handleSelectDate(invalidDate);
      }
    }
  });

  if (!date) return null;

  return (
    <Stack>
      <MaskedTextField
        styles={textStyles}
        label={label}
        mask="99/99/9999"
        value={toUtcDateString(date)}
        errorMessage={errorMessage}
        onChange={handleTextChange}
        onKeyPress={handleKeyPress}
      />
      <Calendar
        showMonthPickerAsOverlay
        highlightSelectedMonth
        isMonthPickerVisible={false}
        showGoToToday={false}
        value={toAbsoluteDate(date)}
        minDate={toAbsoluteDate(validMinDate)}
        maxDate={toAbsoluteDate(validMaxDate)}
        onSelectDate={handleSelectDate}
      />
    </Stack>
  );
};

export default CalendarControl;

const textStyles: Partial<ITextFieldStyles> = {
  root: {
    maxWidth: 218,
  },
};
