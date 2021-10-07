import { useState } from "react";
import { Calendar, MaskedTextField, Stack } from "@fluentui/react";
import { dayjs, toUtcDate } from "utils";
import { Dayjs } from "dayjs";

interface Props {
  date: Dayjs;
  label: string;
  onSelectDate: (date: Dayjs) => void;
  validMinDate: Dayjs;
  validMaxDate: Dayjs;
}

const CalendarControl = ({
  date,
  label,
  onSelectDate,
  validMinDate,
  validMaxDate,
}: Props) => {
  const [workingDate, setWorkingDate] = useState<Dayjs>(date);

  const handleSelectDate = (newDate: Date) => {
    const day = dayjs.utc(newDate);
    setWorkingDate(day);
    onSelectDate(day);
  };

  console.log("valid min", validMinDate);
  console.log("valid max", validMaxDate);
  return (
    <Stack>
      <MaskedTextField
        label={label}
        mask="99/99/9999"
        value={toUtcDate(workingDate)}
        onGetErrorMessage={value => {
          const day = dayjs(value);
          if (!day.isValid()) return "Invalid date, use MM/DD/YYYY";

          if (day.isBefore(validMinDate))
            return `Date must be after ${toUtcDate(
              validMinDate.subtract(1, "day")
            )}`;

          if (day.isAfter(validMaxDate))
            return `Date must be before ${toUtcDate(validMaxDate.add(1, "day"))}`;

          return "";
        }}
        onChange={v => {
          const newDay = dayjs.utc(v.currentTarget.value);
          newDay.isValid() && handleSelectDate(newDay.toDate());
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
