import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IStacCollection } from "types/stac";
import { ViewerMode } from "./types";
export interface MosaicState {
  mode: ViewerMode;
  collection: IStacCollection | null;
  queryName: string | null;
  renderOptions: string | null;
}

const initialState: MosaicState = {
  collection: null,
  mode: ViewerMode.mosaic,
  queryName: null,
  renderOptions: null,
};

export const mosaicSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<ViewerMode>) => {
      state.mode = action.payload;
    },
    setCollection: (state, action: PayloadAction<IStacCollection | null>) => {
      state.collection = action.payload;
      state.queryName = null;
      state.renderOptions = null;
    },
    setQueryName: (state, action: PayloadAction<string>) => {
      state.queryName = action.payload;
      // TODO: if the existing render option is still valid, don't reset it here.
      state.renderOptions = null;
    },
    setRenderOptions: (state, action: PayloadAction<string>) => {
      state.renderOptions = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMode, setCollection, setQueryName, setRenderOptions } =
  mosaicSlice.actions;

export default mosaicSlice.reducer;
