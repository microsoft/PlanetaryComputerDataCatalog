export type RangeType = "start" | "end";

export interface ValidationState {
  start: boolean;
  end: boolean;
}
export type ValidAction = { [rangeKey: RangeType]: boolean };
