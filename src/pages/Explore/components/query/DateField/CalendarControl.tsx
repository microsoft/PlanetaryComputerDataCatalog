import { useState } from "react";
import { Calendar, MaskedTextField, Stack } from "@fluentui/react";
import { dayjs, toUtcDate } from "utils";

interface Props {
  date: Date;
  label: string;
  onSelectDate: (date: Date) => void;
  validMinDate: Date;
  validMaxDate: Date;
}

const CalendarControl = ({
  date,
  label,
  onSelectDate,
  validMinDate,
  validMaxDate,
}: Props) => {
  const [workingDate, setWorkingDate] = useState<Date>(date);

  const handleSelectDate = (date: Date) => {
    setWorkingDate(date);
    onSelectDate(date);
  };

  return (
    <Stack>
      <MaskedTextField
        label={label}
        mask="99/99/9999"
        value={toUtcDate(workingDate)}
        onGetErrorMessage={value => {
          const day = dayjs.utc(value);
          if (!day.isValid()) return "Invalid date, use MM/DD/YYYY";
          if (day.isBefore(validMinDate))
            return `Date must be after ${toUtcDate(validMinDate)}`;
          if (day.isAfter(validMaxDate))
            return `Date must be before ${toUtcDate(validMaxDate)}`;
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
        value={workingDate}
        onSelectDate={handleSelectDate}
        minDate={validMinDate}
        maxDate={validMaxDate}
      />
    </Stack>
  );
};

export default CalendarControl;
