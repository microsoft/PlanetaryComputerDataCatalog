import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { uniqueId } from "lodash-es";

import { IStacCollection } from "types/stac";
import { registerStacFilter } from "utils/requests";
import { LayerType } from "../enums";
import {
  ILayerState,
  IMosaic,
  IMosaicRenderOption,
  IMosaicState,
  IOrderedLayers,
} from "../types";
import { resetMosaicQueryStringState } from "../utils";
import { DEFAULT_MIN_ZOOM } from "../utils/constants";
import { CqlExpressionParser } from "../utils/cql";
import { CqlExpression, ICqlExpressionList } from "../utils/cql/types";
import { getCurrentMosaicDraft, updateSearchId } from "./helpers";
import { loadMosaicState } from "./inititalStateHelper";
import { AppThunk, ExploreState } from "./store";

export const initialMosaicState: IMosaic = {
  name: null,
  description: null,
  cql: [],
  sortby: "desc",
  searchId: null,
};

export const initialLayerState: ILayerState = {
  layerId: "",
  collection: null,
  query: initialMosaicState,
  isCustomQuery: false,
  isPinned: false,
  renderOption: null,
  layer: {
    minZoom: DEFAULT_MIN_ZOOM,
    maxExtent: [],
    opacity: 100,
    visible: true,
  },
};

const initialState: IMosaicState = {
  layers: {},
  layerOrder: [],
  currentEditingLayerId: null,
  isLoadingInitialState: true,
};

export const loadDataFromQuery = createAsyncThunk<boolean, boolean>(
  "initial-load",
  async (_, { dispatch }) => {
    try {
      loadMosaicState(dispatch);
    } catch (e) {
      console.error(e);
    } finally {
      return false;
    }
  }
);

export const setMosaicQuery = createAsyncThunk<string, IMosaic>(
  "cql-api/registerQuery",
  async (queryInfo: IMosaic, { getState, dispatch }) => {
    // Update the new mosaic info into state
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

export const resetMosaicState =
  (layerId: string): AppThunk =>
  dispatch => {
    resetMosaicQueryStringState();
    dispatch(removeLayerById(layerId));
  };

export const mosaicSlice = createSlice({
  name: "mosaic",
  initialState,
  reducers: {
    setCurrentEditingLayerId: (state, action: PayloadAction<string>) => {
      state.currentEditingLayerId = action.payload;
    },

    setCollection: (state, action: PayloadAction<IStacCollection>) => {
      // When setting a new collection, remove the currently edited mosaic layer
      // and the search order, if it is not pinned
      const currentMosaic = getCurrentMosaicDraft(state);
      if (!currentMosaic.isPinned) {
        state.currentEditingLayerId &&
          delete state.layers[state.currentEditingLayerId];
        state.layerOrder = state.layerOrder.filter(
          id => id !== state.currentEditingLayerId
        );
      }

      state.currentEditingLayerId = uniqueId(action.payload.id);
      state.layers[state.currentEditingLayerId] = {
        ...initialLayerState,
        collection: action.payload,
        layerId: state.currentEditingLayerId,
      };
      state.layerOrder = [state.currentEditingLayerId].concat(state.layerOrder);
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

      if (action.payload.minZoom !== undefined) {
        mosaic.layer.minZoom = action.payload.minZoom;
      }

      // Backwards compatibility for old render options
      if (!renderOption.type) {
        renderOption.type = LayerType.tile;
      }

      mosaic.renderOption = renderOption;
    },

    setBulkLayers: (state, action: PayloadAction<IOrderedLayers>) => {
      state.layers = action.payload.layers;
      state.layerOrder = action.payload.layerOrder;
    },

    addLayer: (state, action: PayloadAction<ILayerState>) => {
      const layer = action.payload;
      state.layers[layer.layerId] = layer;
      state.layerOrder = [layer.layerId].concat(state.layerOrder);
    },

    setLayerMinZoom: (state, action: PayloadAction<number>) => {
      const mosaic = getCurrentMosaicDraft(state);
      mosaic.layer.minZoom = action.payload;
    },

    setLayerOpacity: (
      state,
      action: PayloadAction<{ id: string; value: number }>
    ) => {
      const mosaic = state.layers[action.payload.id];
      mosaic.layer.opacity = action.payload.value;
    },

    setLayerVisible: (
      state,
      action: PayloadAction<{ id: string; value: boolean }>
    ) => {
      const mosaic = state.layers[action.payload.id];
      mosaic.layer.visible = action.payload.value;
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
      state.currentEditingLayerId = null;
    },

    removeLayerById: (state, action: PayloadAction<string>) => {
      const layerId = action.payload;
      if (layerId in state.layers) {
        delete state.layers[layerId];
        state.layerOrder = state.layerOrder.filter(id => id !== layerId);
      }
    },

    moveLayerUp: (state, action: PayloadAction<string>) => {
      const layerId = action.payload;
      const index = state.layerOrder.indexOf(layerId);
      if (index > 0) {
        state.layerOrder.splice(index, 1);
        state.layerOrder.splice(index - 1, 0, layerId);
      }
    },

    moveLayerDown: (state, action: PayloadAction<string>) => {
      const layerId = action.payload;
      const index = state.layerOrder.indexOf(layerId);
      if (index < state.layerOrder.length - 1) {
        state.layerOrder.splice(index, 1);
        state.layerOrder.splice(index + 1, 0, layerId);
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

    builder.addCase(
      loadDataFromQuery.fulfilled,
      (state, action: PayloadAction<boolean>) => {
        state.isLoadingInitialState = action.payload;
      }
    );
  },
});

export const {
  pinCurrentMosaic,
  removeLayerById,
  resetMosaic,
  setCurrentEditingLayerId,
  setCollection,
  setQuery,
  setRenderOption,
  setBulkLayers,
  setLayerMinZoom,
  setLayerOpacity,
  setLayerVisible,
  setIsCustomQuery,
  setCustomQueryBody,
  addLayer,
  addOrUpdateCustomCqlExpression,
  removeCustomCqlProperty,
  moveLayerDown,
  moveLayerUp,
} = mosaicSlice.actions;

// Custom selector to get the current mosaic CQL query
export const selectCurrentCql = (state: ExploreState) => {
  const mosaic = selectCurrentMosaic(state);
  return mosaic?.query?.cql || [];
};

// Custom selector to get the current mosaic layer being edited / displayed
export const selectCurrentMosaic = (state: ExploreState): ILayerState => {
  if (
    !state.mosaic.currentEditingLayerId ||
    !state.mosaic.layers[state.mosaic.currentEditingLayerId]
  ) {
    return initialLayerState;
  }

  return state.mosaic.layers[state.mosaic.currentEditingLayerId];
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
