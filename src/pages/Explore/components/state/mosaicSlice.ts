import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IStacCollection } from "types/stac";
import { getMosaicQueryHashKey } from "utils/requests";
import { ViewerMode } from "./types";
export interface MosaicState {
  mode: ViewerMode;
  collection: IStacCollection | null;
  query: {
    name: string | null;
    cql: string | null;
    hash: string | null;
  };
  renderOptions: string | null;
  options: {
    showEdit: boolean;
    showResults: boolean;
  };
}

const initialState: MosaicState = {
  collection: null,
  mode: ViewerMode.mosaic,
  query: {
    name: null,
    cql: null,
    hash: null,
  },
  renderOptions: null,
  options: {
    showEdit: false,
    showResults: false,
  },
};

export const setMosaicQuery = createAsyncThunk<string>(
  "cql-api/createQueryHashkey",
  async (queryInfo: any, { dispatch }) => {
    dispatch(setQuery(queryInfo));

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
      state.query.cql = null;
      state.renderOptions = null;
    },
    // TODO: proper typing
    setQuery: (state, action: PayloadAction<any>) => {
      state.query.name = action.payload.name;
      state.query.cql = action.payload.cql;

      // TODO: if the existing render option is still valid, don't reset it here.
      state.renderOptions = null;
    },
    setRenderOptions: (state, action: PayloadAction<string>) => {
      state.renderOptions = action.payload;
    },
    setShowResults: (state, action: PayloadAction<boolean>) => {
      state.options.showResults = action.payload;
    },
    setShowEdit: (state, action: PayloadAction<boolean>) => {
      state.options.showEdit = action.payload;
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

export const {
  setMode,
  setCollection,
  setQuery,
  setRenderOptions,
  setShowEdit,
  setShowResults,
} = mosaicSlice.actions;

export default mosaicSlice.reducer;
