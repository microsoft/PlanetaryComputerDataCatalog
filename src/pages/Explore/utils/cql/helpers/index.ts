import { dayjs } from "utils";

export const rangeIsOnSameDay = (
  dateExpressionValue: string | string[] | undefined
) => {
  if (!dateExpressionValue) return false;

  if (!Array.isArray(dateExpressionValue)) {
    return false;
  }

  if (dateExpressionValue.length !== 2) {
    return false;
  }

  const [date1, date2] = dateExpressionValue.map(d => dayjs.utc(d));

  return date1.isSame(date2, "day");
};
