import { sortByPosition, capitalize, titleCase, isort } from "./index";

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

test("sorts by positions in reference list", () => {
  const ref = ["c", "b", "a"];
  const test = ["a", "b", "c"];

  const out = test.sort(sortByPosition(ref));
  expect(out).toEqual(expect.arrayContaining(ref));
});

test("case insensitive sort", () => {
  const un = ["z", "B", "a", "C"];
  expect(un.sort(isort)).toEqual(["a", "B", "C", "z"]);
});
