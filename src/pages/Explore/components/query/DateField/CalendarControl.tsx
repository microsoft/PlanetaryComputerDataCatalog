import { useRef, useEffect, useContext, useState } from "react";
import {
  Calendar,
  Stack,
  FontSizes,
  FontWeights,
  getTheme,
  ICalendarDayStyles,
  Label,
  IStackStyles,
  Text,
  ITextStyles,
  ICalendarDayProps,
  ICalendarMonthStyles,
  ILabelStyles,
} from "@fluentui/react";
import { dayjs, toAbsoluteDate, toDateString } from "utils";
import { DateFieldContext } from "./context";
import { DateRangeAction, RangeType } from "./types";
import { CalendarNavControl } from "./CalendarNavControl";

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

  const handleSelectDate = (newDate: Date) => {
    setDateValidation(newDate);
    onSelectDate({ [rangeType]: dayjs(newDate) });
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
        return `* Start date must be before end date`;
      } else if (
        rangeType === "end" &&
        workingDates?.start &&
        day.isBefore(workingDates.start)
      ) {
        return `* End date must be after start date`;
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

  return (
    <Stack styles={controlStyles}>
      <Label styles={labelStyles}>{label}</Label>
      {navigation}
      <Calendar
        ref={ref}
        showMonthPickerAsOverlay={true}
        highlightSelectedMonth
        isMonthPickerVisible={false}
        showGoToToday={false}
        value={toAbsoluteDate(date)}
        minDate={toAbsoluteDate(validMinDate)}
        maxDate={toAbsoluteDate(validMaxDate)}
        onSelectDate={handleSelectDate}
        calendarDayProps={{ ...calendarDayProps, ...calDayNav }}
        calendarMonthProps={calendarMonthProps}
      />
      <Text styles={errorMsgStyles}>{errorMessage}</Text>
    </Stack>
  );
};

export default CalendarControl;

const theme = getTheme();
const controlStyles: Partial<IStackStyles> = {
  root: {
    maxWidth: 220,
  },
};

const labelStyles: ILabelStyles = {
  root: {
    textTransform: "uppercase",
    marginLeft: 8,
    fontSize: 13,
  },
};

const errorMsgStyles: Partial<ITextStyles> = {
  root: {
    color: theme.palette.redDark,
    fontSize: FontSizes.size12,
    paddingLeft: theme.spacing.m,
  },
};

const calendarStyles: Partial<ICalendarDayStyles> = {
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
    color: theme.palette.white,
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
  styles: calendarStyles,
  navigationIcons: {
    leftNavigation: "ChevronLeft",
    rightNavigation: "ChevronRight",
  },
};

const calendarMonthProps: Partial<ICalendarDayProps> = {
  styles: monthStyles,
  navigationIcons: {
    leftNavigation: "ChevronLeft",
    rightNavigation: "ChevronRight",
  },
};
