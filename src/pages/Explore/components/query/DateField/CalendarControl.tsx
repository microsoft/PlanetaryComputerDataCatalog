import { useContext, useState } from "react";
import { Calendar, MaskedTextField, Stack } from "@fluentui/react";
import { capitalize, dayjs, toDateString } from "utils";
import { Dayjs } from "dayjs";
import { DateFieldContext } from "./context";
import { RangeType } from "./types";

interface Props {
  date: Dayjs;
  rangeType: RangeType;
  onSelectDate: (date: Dayjs) => void;
}

const CalendarControl = ({ date, rangeType, onSelectDate }: Props) => {
  const [workingDate, setWorkingDate] = useState<Dayjs>(date);
  const { validMaxDate, validMinDate, setValidation } = useContext(DateFieldContext);

  const handleSelectDate = (newDate: Date) => {
    const day = dayjs(newDate);
    setWorkingDate(day);
    onSelectDate(day);
  };

  const dateValidation = (value: Date | string) => {
    const errorMessage = getErrorMessage(value);

    // Dispatch to the parent context useing the rangeType key provided
    const validation = { [rangeType]: errorMessage ? false : true };
    setValidation(validation);

    // The calendar control determines validation state by the presense or absence of a
    // string which is used as a validation message.
    return errorMessage;
  };

  const getErrorMessage = (value: Date | string) => {
    const day = dayjs(value);
    if (!day.isValid()) return "Invalid date, use MM/DD/YYYY";

    if (day.isBefore(validMinDate))
      return `Date must be after ${toDateString(validMinDate.subtract(1, "day"))}`;

    if (day.isAfter(validMaxDate))
      return `Date must be before ${toDateString(validMaxDate.add(1, "day"))}`;

    return "";
  };

  return (
    <Stack>
      <MaskedTextField
        label={`${capitalize(rangeType)} Date`}
        mask="99/99/9999"
        value={toDateString(workingDate)}
        onGetErrorMessage={dateValidation}
        onChange={v => {
          const newDay = dayjs(v.currentTarget.value);
          const valid = newDay.isValid() && getErrorMessage(newDay.toDate()) === "";
          valid && handleSelectDate(newDay.toDate());
        }}
      />
      <Calendar
        showMonthPickerAsOverlay
        highlightSelectedMonth
        isMonthPickerVisible={false}
        showGoToToday={false}
        value={workingDate.toDate()}
        onSelectDate={handleSelectDate}
        minDate={validMinDate.toDate()}
        maxDate={validMaxDate.toDate()}
      />
    </Stack>
  );
};

export default CalendarControl;
