import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { IStacCollection } from "types/stac";
import { registerStacFilter } from "utils/requests";
import { IMosaic, IMosaicRenderOption } from "../types";
import { getIsCustomQueryString, resetMosaicQueryStringState } from "../utils";
import { DEFAULT_MIN_ZOOM } from "../utils/constants";
import { CqlExpressionParser } from "../utils/cql";
import { CqlExpression, ICqlExpressionList } from "../utils/cql/types";
import { AppThunk, ExploreState } from "./store";

const isCustomQueryOnLoad = getIsCustomQueryString();

export interface IMosaicState {
  collection: IStacCollection | null;
  query: IMosaic;
  isCustomQuery: boolean;
  customQuery: IMosaic;
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

const initialMosaicState: IMosaic = {
  name: null,
  description: null,
  cql: [],
  sortby: null,
  searchId: null,
};

const initialState: IMosaicState = {
  collection: null,
  query: initialMosaicState,
  isCustomQuery: isCustomQueryOnLoad,
  customQuery: initialMosaicState,
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
  "cql-api/registerQuery",
  async (queryInfo: IMosaic, { getState, dispatch }) => {
    dispatch(setQuery(queryInfo));

    const state = getState() as ExploreState;
    const collectionId = state.mosaic.collection?.id;
    const cql = selectCurrentCql(state);

    const searchId = await registerStacFilter(collectionId, queryInfo, cql);
    return searchId;
  }
);

export const setCustomCqlExpressions = createAsyncThunk<string, CqlExpression>(
  "cql-api/registerCustomQuery",
  async (
    cqlExpression: CqlExpression | ICqlExpressionList,
    { getState, dispatch }
  ) => {
    const expressions = Array.isArray(cqlExpression)
      ? cqlExpression
      : [cqlExpression];
    expressions.forEach(expression => {
      dispatch(addOrUpdateCustomCqlExpression(expression));
    });

    const state = getState() as ExploreState;
    const collectionId = state.mosaic.collection?.id;
    const queryInfo = state.mosaic.customQuery;
    const cql = selectCurrentCql(state);

    const searchId = await registerStacFilter(collectionId, queryInfo, cql);
    return searchId;
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
    setCollection: (state, action: PayloadAction<IStacCollection>) => {
      state.collection = action.payload;
    },
    setCollectionDefaultState: (
      state,
      action: PayloadAction<IStacCollection | null>
    ) => {
      state.collection = action.payload;
      state.query = initialMosaicState;
      state.renderOption = null;
      state.isCustomQuery = false;
      state.customQuery = initialMosaicState;
    },
    setQuery: (state, action: PayloadAction<IMosaic>) => {
      state.query = { ...action.payload, searchId: null };
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
        state.customQuery.searchId = null;
      }

      state.isCustomQuery = action.payload;
    },
    setCustomQueryBody: (state, action: PayloadAction<IMosaic>) => {
      state.customQuery = action.payload;
    },
    addOrUpdateCustomCqlExpression: (
      state,
      action: PayloadAction<CqlExpression>
    ) => {
      const draft = state.customQuery.cql;
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
      const draft = state.customQuery.cql;
      const property = action.payload;
      const existingIndex = draft.findIndex(
        exp => new CqlExpressionParser(exp).property === property
      );

      if (existingIndex > -1) {
        draft.splice(existingIndex, 1);
      }
    },
    resetMosaic: () => {
      // Explicitly set isCustomQuery since the initial state may have been
      // informed by querystring
      return { ...initialState, ...{ isCustomQuery: false } };
    },
  },
  extraReducers: builder => {
    builder.addCase(
      setMosaicQuery.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.query.searchId = action.payload;
      }
    );

    builder.addCase(
      setCustomCqlExpressions.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.customQuery.searchId = action.payload;
      }
    );
  },
});

export const {
  resetMosaic,
  setCollection,
  setCollectionDefaultState,
  setQuery,
  setRenderOption,
  setShowEdit,
  setShowResults,
  setLayerMinZoom,
  setIsCustomQuery,
  setCustomQueryBody,
  addOrUpdateCustomCqlExpression,
  removeCustomCqlExpression,
} = mosaicSlice.actions;

export const selectCurrentCql = (state: ExploreState) => {
  return state.mosaic.isCustomQuery
    ? state.mosaic.customQuery.cql
    : state.mosaic.query.cql;
};

export default mosaicSlice.reducer;
