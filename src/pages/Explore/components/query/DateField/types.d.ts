import { Dayjs } from "dayjs";

export type RangeType = "start" | "end";

export interface ValidationState {
  start: boolean;
  end: boolean;
}
export interface ValidationAction {
  [rangeKey: RangeType]: boolean;
}

export interface DateRangeState {
  start: Dayjs;
  end: Dayjs | null;
}
export interface DateRangeAction {
  [rangeKey: RangeType]: Dayjs;
}
