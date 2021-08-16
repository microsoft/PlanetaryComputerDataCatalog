import { configureStore } from "@reduxjs/toolkit";
import mosaicReducer from "./mosaicSlice";

export const store = configureStore({
  reducer: {
    mosaic: mosaicReducer,
  },
});

export type ExploreState = ReturnType<typeof store.getState>;
export type ExploreDispatch = typeof store.dispatch;
