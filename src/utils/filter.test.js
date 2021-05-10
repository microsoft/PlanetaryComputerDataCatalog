import { filter } from "./filter";

const objs = [
  { key1: "Four score and seven", key2: ["years", "ago", "global"] },
  { key1: "Ask not what you", key2: ["can", "do", "global"] },
  { key1: "FOO BAR BAZ GLOBAL", key2: ["SCORE"] },
];

const f = filter(objs, ["key1", "key2"]);

test("filter finds whole word", () => {
  expect(f("score").length).toStrictEqual(2);
});

test("filter finds partial word", () => {
  expect(f("sco").length).toStrictEqual(2);
});

test("filter finds in string and array", () => {
  expect(f("global").length).toStrictEqual(3);
});

test("filter returns empty array for no match", () => {
  expect(f("XXX")).toEqual([]);
});

test("filter returns whole item for match", () => {
  expect(f("years")[0]).toEqual(objs[0]);
});

test("filter finds in array only", () => {
  expect(f("can").length).toStrictEqual(1);
  expect(f("can")[0]).toEqual(objs[1]);
});

test("filter converts number to string for comparison", () => {
  const test = [{ key1: [1978, "hello", "world"] }];
  const fNum = filter(test, ["key1"]);

  expect(fNum("1978")[0]).toEqual(test[0]);
});
