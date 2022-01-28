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

export interface ILayerState {
  collection: IStacCollection | null;
  query: IMosaic;
  isCustomQuery: boolean;
  isPinned: boolean;
  renderOption: IMosaicRenderOption | null;
  layer: {
    minZoom: number;
    maxExtent: number[];
  };
}

export type CurrentLayers = Record<string, ILayerState>;
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
  layers: CurrentLayers;
  options: {};
  currendEditingSearchId: string | null;
}

const initialMosaicState: IMosaic = {
  name: null,
  description: null,
  cql: [],
  sortby: null,
  searchId: null,
};

const initialLayerState: ILayerState = {
  collection: null,
  query: initialMosaicState,
  isCustomQuery: isCustomQueryOnLoad,
  isPinned: false,
  renderOption: null,
  layer: {
    minZoom: DEFAULT_MIN_ZOOM,
    maxExtent: [],
  },
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
  layers: {},
  options: {},
  currendEditingSearchId: null,
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

    return await registerUpdatedSearch(getState);
  }
);

export const removeCustomCqlExpression = createAsyncThunk<string, string>(
  "cql-api/removeCqlProperties",
  async (property: string, { getState, dispatch }) => {
    dispatch(removeCustomCqlProperty(property));

    return await registerUpdatedSearch(getState);
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

      state.currendEditingSearchId = "loading";
      state.layers[state.currendEditingSearchId] = {
        ...initialLayerState,
        collection: action.payload,
      };
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

      state.currendEditingSearchId = "loading";
      state.layers[state.currendEditingSearchId] = {
        ...initialLayerState,
        collection: action.payload,
      };
    },
    setQuery: (state, action: PayloadAction<IMosaic>) => {
      const query = { ...action.payload, searchId: null };
      state.query = query;

      if (!state.currendEditingSearchId) {
        return;
      }
      state.layers[state.currendEditingSearchId].query = query;
    },
    setRenderOption: (state, action: PayloadAction<IMosaicRenderOption>) => {
      const renderOption = action.payload;
      if (!action.payload.minZoom) {
        renderOption.minZoom = DEFAULT_MIN_ZOOM;
      }
      state.renderOption = renderOption;

      if (!state.currendEditingSearchId) {
        return;
      }
      state.layers[state.currendEditingSearchId].renderOption = renderOption;
    },
    setLayerMinZoom: (state, action: PayloadAction<number>) => {
      state.layer.minZoom = action.payload;
    },
    setIsCustomQuery: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.customQuery = initialMosaicState;
      }

      state.isCustomQuery = action.payload;

      if (!state.currendEditingSearchId) {
        return;
      }
      state.layers[state.currendEditingSearchId].isCustomQuery = action.payload;
      state.layers[state.currendEditingSearchId].query = initialMosaicState;
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
        draft.splice(draft.length, 0, action.payload);
      } else {
        draft.splice(existingIndex, 1, action.payload);
      }

      // ========================== Multi
      if (!state.currendEditingSearchId) {
        return;
      }

      const draft1 = state.layers[state.currendEditingSearchId].query.cql;
      const newExpProperty1 = new CqlExpressionParser(action.payload).property;
      const existingIndex1 = draft.findIndex(
        exp => new CqlExpressionParser(exp).property === newExpProperty1
      );

      if (existingIndex1 === -1) {
        draft1.splice(draft1.length, 0, action.payload);
      } else {
        draft1.splice(existingIndex1, 1, action.payload);
      }
    },
    removeCustomCqlProperty: (state, action: PayloadAction<string>) => {
      const draft = state.customQuery.cql;
      const property = action.payload;
      const existingIndex = draft.findIndex(
        exp => new CqlExpressionParser(exp).property === property
      );

      if (existingIndex > -1) {
        draft.splice(existingIndex, 1);
      }

      // ========================== Multi
      if (!state.currendEditingSearchId) {
        return;
      }
      const draft1 = state.layers[state.currendEditingSearchId].query.cql;
      const property1 = action.payload;
      const existingIndex1 = draft1.findIndex(
        exp => new CqlExpressionParser(exp).property === property1
      );

      if (existingIndex1 > -1) {
        draft1.splice(existingIndex1, 1);
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
        const newSearchId = action.payload;
        state.query.searchId = newSearchId;

        if (!state.currendEditingSearchId) {
          return;
        }

        // ========================== Multi
        // Key the layer by the new searchId and remove the temporary loading key
        const oldSearchId =
          state.layers[state.currendEditingSearchId].query.searchId;
        if (newSearchId === oldSearchId) return;

        state.layers[state.currendEditingSearchId].query.searchId = newSearchId;
        state.layers[newSearchId] = state.layers[state.currendEditingSearchId];
        delete state.layers[state.currendEditingSearchId];
        state.currendEditingSearchId = newSearchId;
      }
    );

    builder.addCase(
      setCustomCqlExpressions.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.customQuery.searchId = action.payload;

        // ========================== Multi
        if (!state.currendEditingSearchId) {
          return;
        }
        const newSearchId = action.payload;
        const oldSearchId =
          state.layers[state.currendEditingSearchId].query.searchId;
        if (newSearchId === oldSearchId) return;

        state.layers[state.currendEditingSearchId].query.searchId = newSearchId;
        state.layers[newSearchId] = state.layers[state.currendEditingSearchId];
        delete state.layers[state.currendEditingSearchId];
        state.currendEditingSearchId = newSearchId;
      }
    );

    builder.addCase(removeCustomCqlExpression.fulfilled, (state, action) => {
      state.customQuery.searchId = action.payload;

      // ========================== Multi
      if (!state.currendEditingSearchId) {
        return;
      }

      const newSearchId = action.payload;
      const oldSearchId = state.layers[state.currendEditingSearchId].query.searchId;
      if (newSearchId === oldSearchId) return;

      state.layers[state.currendEditingSearchId].query.searchId = newSearchId;
      state.layers[newSearchId] = state.layers[state.currendEditingSearchId];
      delete state.layers[state.currendEditingSearchId];
      state.currendEditingSearchId = newSearchId;
    });
  },
});

export const {
  resetMosaic,
  setCollection,
  setCollectionDefaultState,
  setQuery,
  setRenderOption,
  setLayerMinZoom,
  setIsCustomQuery,
  setCustomQueryBody,
  addOrUpdateCustomCqlExpression,
  removeCustomCqlProperty,
} = mosaicSlice.actions;

export const selectCurrentCql = (state: ExploreState) => {
  if (!state.mosaic.currendEditingSearchId) {
    return initialMosaicState.cql;
  }

  return state.mosaic.layers[state.mosaic.currendEditingSearchId].query.cql;
};

async function registerUpdatedSearch(getState: () => unknown) {
  const state = getState() as ExploreState;

  const mosaic = getCurrentMosaic(state);
  const collectionId = mosaic.collection?.id;
  const queryInfo = mosaic.query;
  const cql = selectCurrentCql(state);

  const searchId = await registerStacFilter(collectionId, queryInfo, cql);
  return searchId;
}

export default mosaicSlice.reducer;

const getCurrentMosaic = (state: ExploreState) => {
  if (
    !state.mosaic.currendEditingSearchId ||
    !state.mosaic.layers[state.mosaic.currendEditingSearchId]
  ) {
    throw new Error("Specified current search does not exist");
  }

  return state.mosaic.layers[state.mosaic.currendEditingSearchId];
};
