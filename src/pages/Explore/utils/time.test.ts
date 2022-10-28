import {
  adjustTime,
  formatDatetime,
  getDayEnd,
  getDayStart,
  parseDatetime,
} from "./time";

test("Parse and format new date", () => {
  const date = new Date("2020-01-01");
  expect(formatDatetime(parseDatetime(date))).toEqual("2020-01-01T00:00:00Z");
});

test("Parse and format date string with time", () => {
  const date = "2020-01-01 19:00:00Z";
  expect(formatDatetime(parseDatetime(date))).toEqual("2020-01-01T19:00:00Z");
});

test("Adjust time of date", () => {
  const date = new Date("2020-01-01");
  const adjusted = adjustTime(date, "19:00:00");
  expect(formatDatetime(adjusted)).toEqual("2020-01-01T19:00:00Z");
});

test("Get start of day", () => {
  const date = new Date("2020-01-01");
  const d = getDayStart(date);
  expect(formatDatetime(d)).toEqual("2020-01-01T00:00:00Z");
});

test("Get end of day", () => {
  const date = new Date("2020-01-01");
  const d = getDayEnd(date);
  expect(formatDatetime(d)).toEqual("2020-01-01T23:59:59Z");
});
