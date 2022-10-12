import { Dayjs } from "dayjs";
import { dayjs } from "utils";

// Time utilities

export const parseDatetime = (date: Date | string | Dayjs) => {
  return dayjs(date).utc();
};

export const formatDatetime = (date: Date | string | Dayjs) => {
  const d = parseDatetime(date);
  return d.format();
};

export const formatDateShort = (date: Date | string | Dayjs) => {
  const d = parseDatetime(date);
  return d.format("MM/DD/YYYY");
};

export const formatDatetimeHuman = (
  date: Date | string | Dayjs,
  forceShort: boolean | undefined = false,
  shortenIfBoundaryTime: boolean | undefined = false
) => {
  const d = parseDatetime(date);
  const dayBoundary =
    d.format("HH:mm:ss") === "00:00:00" || d.format("HH:mm:ss") === "23:59:59";

  if (dayBoundary && shortenIfBoundaryTime) {
    return formatDateShort(d);
  }

  if (forceShort) {
    return d.format(`MM/DD/YYYY HH:mm`);
  }

  return d.format(`MM/DD/YYYY HH:mm:ss UTC`);
};

export const adjustTime = (date: Date | string | Dayjs, time: string) => {
  const d = parseDatetime(date);
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return d.hour(hours).minute(minutes).second(seconds);
};

export const getDayStart = (date: string | Date | Dayjs) => {
  const d = parseDatetime(date);
  return d.startOf("day");
};

export const getDayEnd = (date: string | Date | Dayjs) => {
  const d = parseDatetime(date);
  return d.endOf("day");
};
