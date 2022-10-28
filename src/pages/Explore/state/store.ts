import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import mosaicReducer from "./mosaicSlice";
import mapReducer from "./mapSlice";
import detailReducer from "./detailSlice";
import animationSlice from "./animationSlice";
import imageSlice from "./imageSlice";

export const store = configureStore({
  reducer: {
    mosaic: mosaicReducer,
    map: mapReducer,
    detail: detailReducer,
    animation: animationSlice,
    image: imageSlice,
  },
});

export type ExploreState = ReturnType<typeof store.getState>;
export type ExploreDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  ExploreState,
  unknown,
  Action<string>
>;
