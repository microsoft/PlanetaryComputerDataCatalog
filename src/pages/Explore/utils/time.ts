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
  return d.format("YYYY-MM-DD");
};

export const formatDatetimeHuman = (
  date: Date | string | Dayjs,
  short: boolean | undefined = false
) => {
  const d = parseDatetime(date);
  const timeFormat = short ? "HH:mm" : ", HH:mm:ss";
  return d.format(`L ${timeFormat}`);
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
