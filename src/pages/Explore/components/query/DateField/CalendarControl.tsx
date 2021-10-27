import { useEffect, useCallback, useContext, useRef } from "react";
import { Calendar, IMaskedTextField, MaskedTextField, Stack } from "@fluentui/react";
import { dayjs, toDateString, toUtcDateString } from "utils";
import { Dayjs } from "dayjs";
import { DateFieldContext } from "./context";
import { DateRangeAction, RangeType } from "./types";

interface CalendarControlProps {
  label: string;
  date: Dayjs | null;
  rangeType: RangeType;
  operator: string;
  onSelectDate: React.Dispatch<DateRangeAction>;
}

const CalendarControl = ({
  label,
  date,
  rangeType,
  operator,
  onSelectDate,
}: CalendarControlProps) => {
  // const [localDate, setLocalDate] = useState<Dayjs | null>(date);
  const textFieldRef: React.RefObject<IMaskedTextField> = useRef(null);
  const {
    validMaxDate,
    validMinDate,
    workingDates,
    validationState,
    setValidation,
  } = useContext(DateFieldContext);

  const handleSelectDate = useCallback(
    (newDate: Date | Dayjs) => {
      const day = dayjs(newDate);
      onSelectDate({ [rangeType]: day });
    },
    [onSelectDate, rangeType]
  );

  const handleTextChange = (
    _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) => {
    const newDay = dayjs(newValue);
    const newDate = newDay.toDate();

    // Check valid date format and if it's in range - only set working date if so
    const valid = newDay.isValid() && getErrorMessage(newDate) === "";
    valid && handleSelectDate(newDate);
  };

  const getErrorMessage = useCallback(
    (value: Date | string) => {
      console.log(rangeType + " re validating...");
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
    },
    [
      operator,
      rangeType,
      validMaxDate,
      validMinDate,
      workingDates?.end,
      workingDates?.start,
    ]
  );

  const dateValidation = (value: Date | string) => {
    const errorMessage = getErrorMessage(value);

    // Dispatch to the parent context useing the rangeType key provided
    const validation = { [rangeType]: !Boolean(errorMessage) };
    setValidation(validation);

    // The calendar control determines validation state by the presense or absence of a
    // string which is used as a validation message.
    return errorMessage;
  };

  useEffect(() => {
    if (
      !validationState[rangeType] &&
      textFieldRef.current &&
      date &&
      !getErrorMessage(toDateString(date))
    ) {
      console.log(rangeType);
      const validation = { [rangeType]: true };
      setValidation(validation);
      handleSelectDate(date);
    }
  }, [
    date,
    getErrorMessage,
    handleSelectDate,
    rangeType,
    setValidation,
    validationState,
    workingDates,
  ]);

  if (!date || !workingDates) return null;

  rangeType === "end" && console.log(" render " + workingDates.end?.toISOString());
  return (
    <Stack>
      <MaskedTextField
        componentRef={textFieldRef}
        label={label}
        mask="99/99/9999"
        value={toUtcDateString(workingDates[rangeType] || date)}
        onGetErrorMessage={dateValidation}
        onChange={handleTextChange}
        validateOnFocusOut
      />
      <Calendar
        showMonthPickerAsOverlay
        highlightSelectedMonth
        isMonthPickerVisible={false}
        showGoToToday={false}
        value={new Date(toUtcDateString(workingDates[rangeType] || date))}
        onSelectDate={handleSelectDate}
        minDate={validMinDate.toDate()}
        maxDate={validMaxDate.toDate()}
      />
    </Stack>
  );
};

export default CalendarControl;
