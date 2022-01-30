import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { IStacCollection } from "types/stac";
import { registerStacFilter } from "utils/requests";
import { ILayerState, IMosaic, IMosaicRenderOption, IMosaicState } from "../types";
import { getIsCustomQueryString, resetMosaicQueryStringState } from "../utils";
import { DEFAULT_MIN_ZOOM } from "../utils/constants";
import { CqlExpressionParser } from "../utils/cql";
import { CqlExpression, ICqlExpressionList } from "../utils/cql/types";
import { getCurrentMosaicDraft, updateSearchId } from "./helpers";
import { AppThunk, ExploreState } from "./store";

const isCustomQueryOnLoad = getIsCustomQueryString();

const initialMosaicState: IMosaic = {
  name: null,
  description: null,
  cql: [],
  sortby: null,
  searchId: null,
};

export const initialLayerState: ILayerState = {
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
  layers: {},
  currentEditingSearchId: null,
};

export const setMosaicQuery = createAsyncThunk<string, IMosaic>(
  "cql-api/registerQuery",
  async (queryInfo: IMosaic, { getState, dispatch }) => {
    const state = getState() as ExploreState;
    dispatch(setQuery(queryInfo));

    const mosaic = selectCurrentMosaic(state);
    const collectionId = mosaic.collection?.id;
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
      // When setting a new collection, remove the currently edited mosaic layer
      // if it is not pinned
      const currentMosaic = getCurrentMosaicDraft(state);
      if (!currentMosaic.isPinned) {
        state.currentEditingSearchId &&
          delete state.layers[state.currentEditingSearchId];
      }

      state.currentEditingSearchId = "loading";
      state.layers[state.currentEditingSearchId] = {
        ...initialLayerState,
        collection: action.payload,
      };
    },

    setQuery: (state, action: PayloadAction<IMosaic>) => {
      const mosaic = getCurrentMosaicDraft(state);
      const query = { ...action.payload, searchId: null };
      mosaic.query = query;
    },

    setRenderOption: (state, action: PayloadAction<IMosaicRenderOption>) => {
      const mosaic = getCurrentMosaicDraft(state);
      const renderOption = Object.assign(
        { minZoom: DEFAULT_MIN_ZOOM },
        action.payload
      );
      mosaic.renderOption = renderOption;
    },

    setLayerMinZoom: (state, action: PayloadAction<number>) => {
      const mosaic = getCurrentMosaicDraft(state);
      mosaic.layer.minZoom = action.payload;
    },

    setIsCustomQuery: (state, action: PayloadAction<boolean>) => {
      const mosaic = getCurrentMosaicDraft(state);
      mosaic.isCustomQuery = action.payload;
      mosaic.query = initialMosaicState;
    },

    setCustomQueryBody: (state, action: PayloadAction<IMosaic>) => {
      const mosaic = getCurrentMosaicDraft(state);
      mosaic.query = action.payload;
    },

    addOrUpdateCustomCqlExpression: (
      state,
      action: PayloadAction<CqlExpression>
    ) => {
      const mosaic = getCurrentMosaicDraft(state);
      const draft = mosaic.query.cql;
      const newExpProperty = new CqlExpressionParser(action.payload).property;
      const existingIndex = draft.findIndex(
        exp => new CqlExpressionParser(exp).property === newExpProperty
      );

      if (existingIndex === -1) {
        draft.splice(draft.length, 0, action.payload);
      } else {
        draft.splice(existingIndex, 1, action.payload);
      }
    },

    removeCustomCqlProperty: (state, action: PayloadAction<string>) => {
      const mosaic = getCurrentMosaicDraft(state);
      const draft = mosaic.query.cql;
      const property = action.payload;
      const existingIndex = draft.findIndex(
        exp => new CqlExpressionParser(exp).property === property
      );

      if (existingIndex > -1) {
        draft.splice(existingIndex, 1);
      }
    },

    pinCurrentMosaic: state => {
      const mosaic = getCurrentMosaicDraft(state);
      mosaic.isPinned = true;
      state.currentEditingSearchId = null;
    },

    resetMosaic: () => {
      return initialState;
    },
  },

  extraReducers: builder => {
    builder.addCase(
      setMosaicQuery.fulfilled,
      (state, action: PayloadAction<string>) => {
        updateSearchId(state, action.payload);
      }
    );

    builder.addCase(
      setCustomCqlExpressions.fulfilled,
      (state, action: PayloadAction<string>) => {
        updateSearchId(state, action.payload);
      }
    );

    builder.addCase(
      removeCustomCqlExpression.fulfilled,
      (state, action: PayloadAction<string>) => {
        updateSearchId(state, action.payload);
      }
    );
  },
});

export const {
  pinCurrentMosaic,
  resetMosaic,
  setCollection,
  setQuery,
  setRenderOption,
  setLayerMinZoom,
  setIsCustomQuery,
  setCustomQueryBody,
  addOrUpdateCustomCqlExpression,
  removeCustomCqlProperty,
} = mosaicSlice.actions;

// Custom selector to get the current mosaic CQL query
export const selectCurrentCql = (state: ExploreState) => {
  const mosaic = selectCurrentMosaic(state);
  return mosaic?.query?.cql || [];
};

// Custom selector to get the current mosaic layer being edited / displayed
export const selectCurrentMosaic = (state: ExploreState) => {
  if (
    !state.mosaic.currentEditingSearchId ||
    !state.mosaic.layers[state.mosaic.currentEditingSearchId]
  ) {
    return initialLayerState;
  }

  return state.mosaic.layers[state.mosaic.currentEditingSearchId];
};

// Custom selector to get all pinned mosaic layers
export const selectPinnedMosaics = (state: ExploreState) => {
  return Object.values(state.mosaic.layers).filter(layer => layer.isPinned);
};

// Register the new CQL query and set the resulting searchId
async function registerUpdatedSearch(getState: () => unknown) {
  const state = getState() as ExploreState;

  const mosaic = selectCurrentMosaic(state);
  const collectionId = mosaic.collection?.id;
  const queryInfo = mosaic.query;
  const cql = selectCurrentCql(state);

  const searchId = await registerStacFilter(collectionId, queryInfo, cql);
  return searchId;
}

export default mosaicSlice.reducer;
