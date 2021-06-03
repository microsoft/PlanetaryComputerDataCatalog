import { capitalize, titleCase, tagCase } from "./index";

test("capitalizes a single word", () => {
  expect(capitalize("word")).toStrictEqual("Word");
});

test("capitalizes first of several words", () => {
  expect(capitalize("word up")).toStrictEqual("Word up");
});

test("titleCase capitalizes a single word", () => {
  expect(capitalize("word")).toStrictEqual("Word");
});

test("capitalizes each of several words", () => {
  expect(titleCase("united states")).toStrictEqual("United States");
});

test("upper cases a short word", () => {
  expect(tagCase("nasa")).toStrictEqual("NASA");
});

test("titleCases a long word", () => {
  expect(tagCase("united states")).toStrictEqual("United States");
});
