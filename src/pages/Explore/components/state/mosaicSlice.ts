import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { some } from "lodash-es";

import { IMosaic, IMosaicRenderOption } from "types";
import { IStacCollection } from "types/stac";
import { getMosaicQueryHashKey } from "utils/requests";

interface IMosaicState extends IMosaic {
  hash: string | null;
}
export interface MosaicState {
  collection: IStacCollection | null;
  query: IMosaicState;
  renderOption: IMosaicRenderOption | null;
  layer: {
    minZoom: number;
    maxExtent: number[];
  };
  options: {
    showEdit: boolean;
    showResults: boolean;
  };
}

const initialMosaicState = {
  name: null,
  description: null,
  cql: null,
  hash: null,
  renderOptions: null,
};

const initialState: MosaicState = {
  collection: null,
  query: initialMosaicState,
  renderOption: null,
  layer: {
    minZoom: 12,
    maxExtent: [],
  },
  options: {
    showEdit: false,
    showResults: false,
  },
};

export const setMosaicQuery = createAsyncThunk<string, IMosaic>(
  "cql-api/createQueryHashkey",
  async (queryInfo: IMosaic, { dispatch }) => {
    dispatch(setQuery(queryInfo));

    const response = await getMosaicQueryHashKey(queryInfo.cql);
    return response.data + queryInfo.name;
  }
);

export const mosaicSlice = createSlice({
  name: "mosaic",
  initialState,
  reducers: {
    setCollection: (state, action: PayloadAction<IStacCollection | null>) => {
      state.collection = action.payload;
      state.query = initialMosaicState;
      state.renderOption = null;
    },
    setQuery: (state, action: PayloadAction<IMosaic>) => {
      const { renderOptions } = action.payload;
      state.query = { ...action.payload, hash: null };

      if (!renderOptions) return;

      if (!state.renderOption) {
        state.renderOption = renderOptions[0];
      } else if (!some(renderOptions, state.renderOption)) {
        state.renderOption = renderOptions[0];
      }
    },
    setRenderOption: (state, action: PayloadAction<string>) => {
      state.renderOption =
        state.query.renderOptions?.find(r => r.name === action.payload) || null;
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
  setCollection,
  setQuery,
  setRenderOption,
  setShowEdit,
  setShowResults,
} = mosaicSlice.actions;

export default mosaicSlice.reducer;
