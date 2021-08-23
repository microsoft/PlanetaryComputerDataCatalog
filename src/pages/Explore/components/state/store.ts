import { configureStore } from "@reduxjs/toolkit";
import mosaicReducer from "./mosaicSlice";
import mapReducer from "./mapSlice";

export const store = configureStore({
  reducer: {
    mosaic: mosaicReducer,
    map: mapReducer,
  },
});

export type ExploreState = ReturnType<typeof store.getState>;
export type ExploreDispatch = typeof store.dispatch;
