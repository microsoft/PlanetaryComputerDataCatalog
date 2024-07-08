import { useRef, useEffect, useContext, useState, useCallback } from "react";
import {
  Calendar,
  Stack,
  FontSizes,
  FontWeights,
  getTheme,
  ICalendarDayStyles,
  Label,
  IStackStyles,
  ICalendarDayProps,
  ICalendarMonthProps,
  ICalendarMonthStyles,
  ILabelStyles,
  MessageBar,
  MessageBarType,
  IMessageBarStyles,
  AnimationDirection,
  ICalendarStyles,
  Separator,
  ISeparatorStyles,
} from "@fluentui/react";
import { dayjs, toAbsoluteDate } from "utils";
import { DateFieldContext } from "./context";
import { DateRangeAction, RangeType } from "./types";
import { CalendarNavControl } from "./CalendarNavControl";
import { Time } from "./Time";
import {
  adjustTime,
  formatDateShort,
  parseDatetime,
} from "pages/Explore/utils/time";

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
  const ref = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [invalidDate, setInvalidDate] = useState<Date>();
  const {
    validMaxDate,
    validMinDate,
    workingDates,
    validationState,
    setValidation,
  } = useContext(DateFieldContext);

  const date = workingDates[rangeType];

  const getErrorMessage = useCallback(
    (value: Date | string) => {
      const day = parseDatetime(value);
      if (!day.isValid()) return "Invalid date, use MM/DD/YYYY";

      if (day.isBefore(validMinDate))
        return `Date must be after ${formatDateShort(
          validMinDate.subtract(1, "day")
        )}`;

      if (day.isAfter(validMaxDate))
        return `Date must be before ${formatDateShort(validMaxDate.add(1, "day"))}`;

      // Validate date ranges to be start <= end
      if (operator === "between") {
        if (
          rangeType === "start" &&
          workingDates?.end &&
          day.isAfter(workingDates.end)
        ) {
          return "Date must be before End Date";
        } else if (
          rangeType === "end" &&
          workingDates?.start &&
          day.isBefore(workingDates.start)
        ) {
          return "Date must be after Start Date";
        }
      }
      return "";
    },
    [
      operator,
      rangeType,
      validMaxDate,
      validMinDate,
      workingDates.end,
      workingDates.start,
    ]
  );

  const setDateValidation = useCallback(
    (value: Date | undefined) => {
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
    },
    [getErrorMessage, rangeType, setValidation, validationState]
  );

  const setSelectedDatetime = useCallback(
    (newDate: Date) => {
      setDateValidation(newDate);
      onSelectDate({ [rangeType]: parseDatetime(newDate) });
    },
    [onSelectDate, rangeType, setDateValidation]
  );

  const handleDateChange = useCallback(
    (newDate: Date) => {
      if (!date) return;

      // When the date has changed from the calendar, we need to apply the
      // existing time to the new date.
      const newDatetime = adjustTime(newDate, date?.format("HH:mm:ss"));
      setSelectedDatetime(newDatetime.toDate());
    },
    [date, setSelectedDatetime]
  );

  const handleTimeChange = useCallback(
    (time: string) => {
      if (!date) return;

      // When the time changes, apply it to the existing selected date.
      const newDate = adjustTime(date, time);
      setSelectedDatetime(newDate.toDate());
    },
    [date, setSelectedDatetime]
  );

  // Cross validate date ranges - when rendering, the current invalid date may
  // have become valid due to changes in the other date range value.
  useEffect(() => {
    if (errorMessage && operator === "between" && invalidDate) {
      // Check the validity of the previous invalid date
      const valid = setDateValidation(invalidDate);

      // If it's now valid, use it as the selected date
      if (valid) {
        handleDateChange(invalidDate);
      }
    }
  });

  const [navigatedDate, setNavigatedDate] = useState<Date>(
    toAbsoluteDate(dayjs(date))
  );

  if (!date) return null;

  const calDayNav: Partial<ICalendarDayProps> = {
    navigatedDate: navigatedDate,
  };

  const navigation = (
    <CalendarNavControl
      onChange={date => setNavigatedDate(date)}
      navigatedDate={navigatedDate}
    />
  );

  const validTimeOperator = ["between", "before", "after"].includes(operator);

  return (
    <Stack styles={controlStyles}>
      <Label styles={labelStyles}>{label}</Label>
      {navigation}
      <Calendar
        ref={ref}
        styles={calendarStyles}
        showMonthPickerAsOverlay={true}
        highlightSelectedMonth
        isMonthPickerVisible={false}
        showGoToToday={false}
        value={toAbsoluteDate(date)}
        minDate={toAbsoluteDate(validMinDate)}
        maxDate={toAbsoluteDate(validMaxDate)}
        onSelectDate={handleDateChange}
        calendarDayProps={{ ...calendarDayProps, ...calDayNav }}
        calendarMonthProps={calendarMonthProps}
      />
      {validTimeOperator && (
        <>
          <Separator styles={separatorStyles} />
          <Time
            time={date.utc().format("HH:mm:ss")}
            rangeType={rangeType}
            onChange={handleTimeChange}
          />
        </>
      )}
      {errorMessage && (
        <MessageBar styles={errorMsgStyles} messageBarType={MessageBarType.error}>
          {errorMessage}
        </MessageBar>
      )}
    </Stack>
  );
};

export default CalendarControl;

const theme = getTheme();
const controlStyles: Partial<IStackStyles> = {
  root: {
    maxWidth: 220,
    marginRight: 3,
  },
};

const calendarStyles: Partial<ICalendarStyles> = {
  root: {
    minHeight: 231,
    "& .ms-FocusZone": {
      paddingBottom: 0,
    },
  },
};

const labelStyles: ILabelStyles = {
  root: {
    textTransform: "uppercase",
    marginTop: 8,
    marginLeft: 8,
    fontSize: 13,
  },
};

const errorMsgStyles: Partial<IMessageBarStyles> = {
  root: {
    margin: 2,
    borderRadius: 2,
  },
};

const calendarDayStyles: Partial<ICalendarDayStyles> = {
  dayCell: {
    fontSize: FontSizes.size14,
    width: 29,
    height: 29,
    lineHeight: 29,
  },
  dayButton: {
    fontSize: FontSizes.size14,
  },
  daySelected: {
    backgroundColor: theme.palette.themePrimary,
    color: theme.palette.white + " !important",
    fontWeight: FontWeights.semibold,
    borderRadius: "100% !important",
    ":after": {
      border: 0,
    },
  },
  datesAbove: {
    ":after": {
      border: 0,
    },
  },
  datesBelow: {
    ":after": {
      border: 0,
    },
  },
  datesLeft: {
    ":after": {
      border: 0,
    },
  },
  datesRight: {
    ":after": {
      border: 0,
    },
  },
  dayIsToday: {
    borderRadius: 0,
    backgroundColor: "unset",
    color: theme.palette.black,
    fontWeight: FontWeights.regular,
  },
  weekDayLabelCell: {
    fontSize: FontSizes.size14,
    fontWeight: FontWeights.semibold,
  },
  disabledStyle: {
    color: theme.palette.neutralTertiary,
  },
  header: {
    display: "none",
  },
  headerIconButton: {
    color: theme.palette.themePrimary,
    ":hover": {
      color: theme.palette.themePrimary,
    },
  },
  table: {
    paddingBottom: 0,
  },
};

const monthStyles: Partial<ICalendarMonthStyles> = {
  navigationButton: {
    color: theme.palette.themePrimary,
    ":hover": {
      color: theme.palette.themePrimary,
    },
  },
};

const calendarDayProps: Partial<ICalendarDayProps> = {
  styles: calendarDayStyles,
  navigationIcons: {
    leftNavigation: "ChevronLeft",
    rightNavigation: "ChevronRight",
  },
};

const calendarMonthProps: Partial<ICalendarMonthProps> = {
  styles: monthStyles,
  navigationIcons: {
    leftNavigation: "ChevronLeft",
    rightNavigation: "ChevronRight",
  },
  animationDirection: AnimationDirection.Horizontal,
};

const separatorStyles: Partial<ISeparatorStyles> = {
  root: {
    marginBottom: 4,
    height: 0,
  },
};
