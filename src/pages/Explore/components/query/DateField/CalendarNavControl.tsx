import { useState, useContext } from "react";
import {
  Dropdown,
  IButtonStyles,
  IconButton,
  IDropdownOption,
  IDropdownStyles,
  IStackStyles,
  IStackTokens,
  Stack,
} from "@fluentui/react";
import { dayjs } from "utils";
import { DateFieldContext } from "./context";
import { Dayjs } from "dayjs";

interface ICalendarNavControlProps {
  onChange: (date: Date) => void;
  navigatedDate: Date;
}

export const CalendarNavControl = ({
  onChange,
  navigatedDate,
}: ICalendarNavControlProps) => {
  const [year, setYear] = useState(navigatedDate.getFullYear());
  const [month, setMonth] = useState(navigatedDate.getMonth());
  const { validMaxDate, validMinDate } = useContext(DateFieldContext);

  const changeMonth = (newMonth: number) => {
    setMonth(newMonth);
    onChange(new Date(year, newMonth));
  };

  const changeYear = (newYear: number) => {
    setYear(newYear);
    onChange(new Date(newYear, month));
  };

  const handleNavMonth = (direction: "next" | "previous") => {
    return () => {
      const curDate = dayjs(new Date(year, month, 1));
      const newDate =
        direction === "next"
          ? curDate.add(1, "month")
          : curDate.subtract(1, "month");

      const newMonth = newDate.month();
      const newYear = newDate.year();
      setMonth(newMonth);
      setYear(newYear);
      onChange(new Date(newYear, newMonth));
    };
  };

  const handleChange = (type: "year" | "month") => {
    return (_: any, option?: IDropdownOption<number> | undefined) => {
      if (!option) return;
      if (type === "year") {
        changeYear(option.key as number);
      } else {
        changeMonth(option.key as number);
      }
    };
  };

  const makeValidator = (year: number) => {
    return (monthIndex: number): boolean => {
      const date = dayjs(new Date(year, monthIndex, 1));
      return (
        validMinDate.isAfter(date, "month") || validMaxDate.isBefore(date, "month")
      );
    };
  };

  return (
    <Stack horizontal horizontalAlign="space-between">
      <Stack horizontal styles={stackStyles} tokens={stackTokens}>
        <Dropdown
          styles={dropdownStyles}
          options={getMonthsOptions(makeValidator(year))}
          onChange={handleChange("month")}
          selectedKey={month}
        />
        <Dropdown
          styles={dropdownStyles}
          options={getYearOptions(validMinDate, validMaxDate)}
          onChange={handleChange("year")}
          selectedKey={year}
        />
      </Stack>
      <Stack horizontal verticalAlign="center">
        <IconButton
          styles={navStyles}
          iconProps={{ iconName: "ChevronLeft" }}
          onClick={handleNavMonth("previous")}
        />
        <IconButton
          styles={navStyles}
          iconProps={{ iconName: "ChevronRight" }}
          onClick={handleNavMonth("next")}
        />
      </Stack>
    </Stack>
  );
};

const getMonthsOptions = (
  validator: (n: number) => boolean
): IDropdownOption<number>[] => {
  //NB: JS Date object provides 0-based month
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months.map((month, index) => ({
    key: index,
    text: month,
    disabled: validator(index),
  }));
};

const getYearOptions = (start: Dayjs, end: Dayjs): IDropdownOption[] => {
  // Generate list of years between start and end
  const startYear = start.year();
  const endYear = end.year();
  const years: IDropdownOption[] = [];

  for (let i = startYear; i <= endYear; i++) {
    years.push({ key: i, text: i.toString() });
  }
  return years;
};

const navStyles: Partial<IButtonStyles> = {
  root: {
    width: 20,
    height: 20,
  },
  icon: {
    fontSize: 12,
  },
};
const dropdownStyles: Partial<IDropdownStyles> = {
  root: {
    width: 70,
  },
};
const stackTokens: IStackTokens = { childrenGap: 5 };
const stackStyles: IStackStyles = {
  root: {
    marginLeft: 8,
  },
};
