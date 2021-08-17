import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IStacCollection } from "types/stac";
import { getMosaicQueryHashKey } from "utils/requests";
import { ViewerMode } from "./types";
export interface MosaicState {
  mode: ViewerMode;
  collection: IStacCollection | null;
  query: {
    name: string | null;
    hash: string | null;
  };
  renderOptions: string | null;
}

const initialState: MosaicState = {
  collection: null,
  mode: ViewerMode.mosaic,
  query: {
    name: null,
    hash: null,
  },
  renderOptions: null,
};

export const setMosaicQuery = createAsyncThunk<string>(
  "cql-api/createQueryHashkey",
  async (queryInfo: any, { dispatch }) => {
    dispatch(setQueryName(queryInfo.name));

    const response = await getMosaicQueryHashKey(queryInfo.cql);
    return response.data;
  }
);

export const mosaicSlice = createSlice({
  name: "mosaic",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<ViewerMode>) => {
      state.mode = action.payload;
    },
    setCollection: (state, action: PayloadAction<IStacCollection | null>) => {
      state.collection = action.payload;
      state.query.name = null;
      state.query.hash = null;
      state.renderOptions = null;
    },
    setQueryName: (state, action: PayloadAction<string>) => {
      state.query.name = action.payload;
      // TODO: if the existing render option is still valid, don't reset it here.
      state.renderOptions = null;
    },
    setRenderOptions: (state, action: PayloadAction<string>) => {
      state.renderOptions = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(
      setMosaicQuery.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.query.hash = action.payload;
      }
    );
  },
});

export const { setMode, setCollection, setQueryName, setRenderOptions } =
  mosaicSlice.actions;

export default mosaicSlice.reducer;
