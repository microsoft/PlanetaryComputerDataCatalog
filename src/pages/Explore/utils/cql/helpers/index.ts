import { dayjs } from "utils";
import { CqlExpressionParser } from "..";

export const rangeIsOnSameDay = (dateExpression: CqlExpressionParser<string>) => {
  if (!Array.isArray(dateExpression.value)) {
    return false;
  }

  if (dateExpression.value.length !== 2) {
    return false;
  }

  const [date1, date2] = dateExpression.value.map(d => dayjs.utc(d));

  return date1.isSame(date2, "day");
};
