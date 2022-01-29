import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { createDraft } from "immer";

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
  layers: CurrentLayers;
  currentEditingSearchId: string | null;
  options: {};
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
  layers: {},
  options: {},
  currentEditingSearchId: null,
};

export const setMosaicQuery = createAsyncThunk<string, IMosaic>(
  "cql-api/registerQuery",
  async (queryInfo: IMosaic, { getState, dispatch }) => {
    dispatch(setQuery(queryInfo));

    const state = getState() as ExploreState;
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
      state.currentEditingSearchId = "loading";
      state.layers[state.currentEditingSearchId] = {
        ...initialLayerState,
        collection: action.payload,
      };
    },

    setCollectionDefaultState: (
      state,
      action: PayloadAction<IStacCollection | null>
    ) => {
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
      const isCustomQuery = action.payload;
      mosaic.isCustomQuery = isCustomQuery;
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

    resetMosaic: () => {
      return initialState;
    },
  },

  extraReducers: builder => {
    builder.addCase(
      setMosaicQuery.fulfilled,
      (state, action: PayloadAction<string>) => {
        const mosaic = getCurrentMosaicDraft(state);
        const newSearchId = action.payload;

        // Key the layer by the new searchId and remove the temporary loading key
        const oldSearchId = mosaic.query.searchId;
        if (newSearchId === oldSearchId) return;

        mosaic.query.searchId = newSearchId;
        state.layers[newSearchId] = mosaic;
        oldSearchId && delete state.layers[oldSearchId];
        state.currentEditingSearchId = newSearchId;
      }
    );

    builder.addCase(
      setCustomCqlExpressions.fulfilled,
      (state, action: PayloadAction<string>) => {
        const mosaic = getCurrentMosaicDraft(state);
        const newSearchId = action.payload;
        const oldSearchId = mosaic.query.searchId;

        if (newSearchId === oldSearchId) return;

        mosaic.query.searchId = newSearchId;
        state.layers[newSearchId] = mosaic;
        oldSearchId && delete state.layers[oldSearchId];
        state.currentEditingSearchId = newSearchId;
      }
    );

    builder.addCase(removeCustomCqlExpression.fulfilled, (state, action) => {
      const mosaic = getCurrentMosaicDraft(state);
      const newSearchId = action.payload;
      const oldSearchId = mosaic.query.searchId;

      if (newSearchId === oldSearchId) return;

      mosaic.query.searchId = newSearchId;
      state.layers[newSearchId] = mosaic;
      oldSearchId && delete state.layers[oldSearchId];
      state.currentEditingSearchId = newSearchId;
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

// Custom selectors
export const selectCurrentCql = (state: ExploreState) => {
  const mosaic = selectCurrentMosaic(state);
  return mosaic?.query?.cql || [];
};

export const selectCurrentMosaic = (state: ExploreState) => {
  if (
    !state.mosaic.currentEditingSearchId ||
    !state.mosaic.layers[state.mosaic.currentEditingSearchId]
  ) {
    return initialLayerState;
  }

  return state.mosaic.layers[state.mosaic.currentEditingSearchId];
};

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

// Get the current mosaic info as an immer draft object
const getCurrentMosaicDraft = (state: WritableDraft<IMosaicState>) => {
  if (!state.currentEditingSearchId || !state.layers[state.currentEditingSearchId]) {
    return createDraft(initialLayerState);
  }

  return state.layers[state.currentEditingSearchId];
};
