import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { IStacCollection } from "types/stac";
import { createMosaicQueryHashkey } from "utils/requests";
import { IMosaic, IMosaicRenderOption } from "../types";
import { resetMosaicQueryStringState } from "../utils";
import { DEFAULT_MIN_ZOOM } from "../utils/constants";
import { CqlExpressionParser } from "../utils/cql";
import { CqlExpression, ICqlExpressionList } from "../utils/cql/types";
import { AppThunk, ExploreState } from "./store";

export interface IMosaicState {
  collection: IStacCollection | null;
  query: IMosaic;
  isCustomQuery: boolean;
  customCqlExpressions: ICqlExpressionList;
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
  cql: [],
  sortby: null,
  hash: null,
  renderOptions: null,
};

const initialState: IMosaicState = {
  collection: null,
  query: initialMosaicState,
  isCustomQuery: false,
  customCqlExpressions: [],
  renderOption: null,
  layer: {
    minZoom: DEFAULT_MIN_ZOOM,
    maxExtent: [],
  },
  options: {
    showResults: true,
    showEdit: false,
  },
};

export const setMosaicQuery = createAsyncThunk<string, IMosaic>(
  "cql-api/createQueryHashkey",
  async (queryInfo: IMosaic, { getState, dispatch }) => {
    dispatch(setQuery(queryInfo));

    const state = getState() as ExploreState;
    const collectionId = state.mosaic.collection?.id;
    const cql = selectCurrentCql(state);

    const hashkey = await createMosaicQueryHashkey(collectionId, queryInfo, cql);
    return hashkey;
  }
);

export const setCustomCqlExpression = createAsyncThunk<string, CqlExpression>(
  "cql-api/createCustomQueryHashkey",
  async (cqlExpression: CqlExpression, { getState, dispatch }) => {
    dispatch(addOrUpdateCustomCqlExpression(cqlExpression));

    const state = getState() as ExploreState;
    const collectionId = state.mosaic.collection?.id;
    const queryPreset = state.mosaic.query;
    const cql = selectCurrentCql(state);

    const hashkey = await createMosaicQueryHashkey(collectionId, queryPreset, cql);
    return hashkey;
  }
);

export const resetMosaicState = (): AppThunk => dispatch => {
  resetMosaicQueryStringState();
  dispatch(resetMosaic());
};

export const mosaicSlice = createSlice({
  name: "mosaic",
  initialState,
  reducers: {
    setCollection: (state, action: PayloadAction<IStacCollection | null>) => {
      state.collection = action.payload;
      state.query = initialMosaicState;
      state.renderOption = null;
      state.isCustomQuery = false;
      state.customCqlExpressions = [];
    },
    setQuery: (state, action: PayloadAction<IMosaic>) => {
      state.query = { ...action.payload, hash: null };
    },
    setIsCustom: (state, action: PayloadAction<boolean>) => {
      state.isCustomQuery = action.payload;
    },
    setRenderOption: (state, action: PayloadAction<IMosaicRenderOption>) => {
      state.renderOption = action.payload;
      if (!action.payload.minZoom) {
        state.renderOption.minZoom = DEFAULT_MIN_ZOOM;
      }
    },
    setShowResults: (state, action: PayloadAction<boolean>) => {
      state.options.showResults = action.payload;
    },
    setShowEdit: (state, action: PayloadAction<boolean>) => {
      state.options.showEdit = action.payload;
    },
    setLayerMinZoom: (state, action: PayloadAction<number>) => {
      state.layer.minZoom = action.payload;
    },
    setIsCustomQuery: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.customCqlExpressions = state.query.cql;
      }
      state.isCustomQuery = action.payload;
    },
    addOrUpdateCustomCqlExpression: (
      state,
      action: PayloadAction<CqlExpression>
    ) => {
      const draft = state.customCqlExpressions;
      const newExpProperty = new CqlExpressionParser(action.payload).property;
      const existingIndex = draft.findIndex(
        exp => new CqlExpressionParser(exp).property === newExpProperty
      );

      if (existingIndex === -1) {
        draft.splice(0, 0, action.payload);
      } else {
        draft.splice(existingIndex, 1, action.payload);
      }
    },
    removeCustomCqlExpression: (state, action: PayloadAction<string>) => {
      const draft = state.customCqlExpressions;
      const property = action.payload;
      const existingIndex = draft.findIndex(
        exp => new CqlExpressionParser(exp).property === property
      );

      if (existingIndex > -1) {
        draft.splice(existingIndex, 1);
      }
    },
    resetMosaic: () => {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder.addCase(
      setMosaicQuery.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.query.hash = action.payload;
      }
    );

    builder.addCase(
      setCustomCqlExpression.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.query.hash = action.payload;
      }
    );
  },
});

export const {
  resetMosaic,
  setCollection,
  setQuery,
  setRenderOption,
  setShowEdit,
  setShowResults,
  setLayerMinZoom,
  setIsCustomQuery,
  addOrUpdateCustomCqlExpression,
  removeCustomCqlExpression,
} = mosaicSlice.actions;

export const selectCurrentCql = (state: ExploreState) => {
  return state.mosaic.isCustomQuery
    ? state.mosaic.customCqlExpressions
    : state.mosaic.query.cql;
};

export default mosaicSlice.reducer;
