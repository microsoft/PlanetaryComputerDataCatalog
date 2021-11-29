import React from "react";
import {
  Dropdown,
  IButtonStyles,
  IconButton,
  IDropdownOption,
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
  const [year, setYear] = React.useState(navigatedDate.getFullYear());
  //NB: JS Date object provides 0-based month, and is manipulated throughout this file to be 1-based
  const [month, setMonth] = React.useState(navigatedDate.getMonth() + 1);
  const { validMaxDate, validMinDate } = React.useContext(DateFieldContext);

  const changeMonth = (newMonth: number) => {
    setMonth(newMonth);
    onChange(new Date(year, newMonth - 1));
  };

  const changeYear = (newYear: number) => {
    setYear(newYear);
    onChange(new Date(newYear, month - 1));
  };

  const handleNavMonth = (direction: "next" | "previous") => {
    return () => {
      const curDate = dayjs(new Date(year, month - 1, 1));
      const newDate =
        direction === "next"
          ? curDate.add(1, "month")
          : curDate.subtract(1, "month");
      changeMonth(newDate.get("month") + 1);
      changeYear(newDate.get("year"));
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

  return (
    <Stack horizontal horizontalAlign="space-between">
      <Stack horizontal styles={stackStyles} tokens={stackTokens}>
        <Dropdown
          options={monthsOptions}
          onChange={handleChange("month")}
          selectedKey={month}
        />
        <Dropdown
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

const monthsOptions: IDropdownOption<number>[] = [
  { key: 1, text: "Jan" },
  { key: 2, text: "Feb" },
  { key: 3, text: "Mar" },
  { key: 4, text: "Apr" },
  { key: 5, text: "May" },
  { key: 6, text: "Jun" },
  { key: 7, text: "Jul" },
  { key: 8, text: "Aug" },
  { key: 9, text: "Sep" },
  { key: 10, text: "Oct" },
  { key: 11, text: "Nov" },
  { key: 12, text: "Dec" },
];

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
const stackTokens: IStackTokens = { childrenGap: 5 };
const stackStyles: IStackStyles = {
  root: {
    marginLeft: 8,
  },
};
