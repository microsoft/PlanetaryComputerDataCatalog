import { useCallback, useContext } from "react";
import { Calendar, MaskedTextField, Stack } from "@fluentui/react";
import { dayjs, toDateString } from "utils";
import { Dayjs } from "dayjs";
import { DateFieldContext } from "./context";
import { DateRangeAction, RangeType } from "./types";

interface CalendarControlProps {
  label: string;
  date: Dayjs | null;
  rangeType: RangeType;
  onSelectDate: React.Dispatch<DateRangeAction>;
}

const CalendarControl = ({
  label,
  date,
  rangeType,
  onSelectDate,
}: CalendarControlProps) => {
  const { validMaxDate, validMinDate, setValidation } = useContext(DateFieldContext);

  const handleSelectDate = (newDate: Date) => {
    const day = dayjs(newDate);
    onSelectDate({ [rangeType]: day });
  };

  const handleTextChange = (
    _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) => {
    const newDay = dayjs(newValue);

    // Check valid date format and if it's in range - only set working date if so
    const valid = newDay.isValid() && getErrorMessage(newDay.toDate()) === "";
    valid && handleSelectDate(newDay.toDate());
  };

  const getErrorMessage = useCallback(
    (value: Date | string) => {
      const day = dayjs(value);
      if (!day.isValid()) return "Invalid date, use MM/DD/YYYY";

      if (day.isBefore(validMinDate))
        return `Date must be after ${toDateString(validMinDate.subtract(1, "day"))}`;

      if (day.isAfter(validMaxDate))
        return `Date must be before ${toDateString(validMaxDate.add(1, "day"))}`;

      return "";
    },
    [validMaxDate, validMinDate]
  );

  const dateValidation = useCallback(
    (value: Date | string) => {
      const errorMessage = getErrorMessage(value);

      // Dispatch to the parent context useing the rangeType key provided
      const validation = { [rangeType]: errorMessage ? false : true };
      setValidation(validation);

      // The calendar control determines validation state by the presense or absence of a
      // string which is used as a validation message.
      return errorMessage;
    },
    [getErrorMessage, rangeType, setValidation]
  );

  if (!date) return null;

  return (
    <Stack>
      <MaskedTextField
        label={label}
        mask="99/99/9999"
        value={toDateString(date)}
        onGetErrorMessage={dateValidation}
        onChange={handleTextChange}
      />
      <Calendar
        showMonthPickerAsOverlay
        highlightSelectedMonth
        isMonthPickerVisible={false}
        showGoToToday={false}
        value={date.toDate()}
        onSelectDate={handleSelectDate}
        minDate={validMinDate.toDate()}
        maxDate={validMaxDate.toDate()}
      />
    </Stack>
  );
};

export default CalendarControl;
