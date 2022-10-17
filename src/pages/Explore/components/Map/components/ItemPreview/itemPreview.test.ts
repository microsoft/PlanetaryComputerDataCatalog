import { truncateMiddle } from "./helpers";

test("Truncate middle with less than length isn't truncated", () => {
  expect(truncateMiddle("short string", 30)).toBe("short string");
});

test("Truncate middle with more than length is truncated", () => {
  expect(truncateMiddle("MYD09Q1.A2022265061.2022274054150", 30)).toBe(
    "MYD09Q1.A202226...1.2022274054150"
  );
});
