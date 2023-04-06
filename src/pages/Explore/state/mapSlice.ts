import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import * as atlas from "azure-maps-control";
import { GeoJsonObject } from "geojson";

import { SidebarPanels } from "../enums";
import { IDrawnShape } from "../types";
import { getCenterAndZoomQueryString } from "../utils";
import { setItemQuickPreview, setShowItemAsDetailLayer } from "./detailSlice";
import { isNull } from "lodash-es";
import { DEFAULT_SIDEBAR_WIDTH } from "../utils/constants";

const { center, zoom } = getCenterAndZoomQueryString();

export interface MapState {
  center: [number, number];
  zoom: number;
  bounds: atlas.data.BoundingBox | null;
  boundaryShape: GeoJsonObject | null;
  showCollectionOutline: boolean;
  showSidebar: boolean;
  sidebarWidth: number;
  useHighDef: boolean;
  previousCenter: [number, number] | null;
  previousZoom: number | null;
  sidebarPanel: SidebarPanels;
  isDrawBboxMode: boolean;
  drawnShape: IDrawnShape | null;
}

const initialState: MapState = {
  center: center || [30, 30],
  zoom: zoom || 2,
  bounds: null,
  boundaryShape: null,
  showCollectionOutline: true,
  showSidebar: true,
  sidebarWidth: DEFAULT_SIDEBAR_WIDTH,
  useHighDef: true,
  previousCenter: null,
  previousZoom: null,
  sidebarPanel: SidebarPanels.itemSearch,
  isDrawBboxMode: false,
  drawnShape: null,
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setCenter: (state, action: PayloadAction<[number, number]>) => {
      state.center = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setCamera: (
      state,
      action: PayloadAction<atlas.CameraOptions & atlas.CameraBoundsOptions>
    ) => {
      if (action.payload.zoom) {
        state.zoom = action.payload.zoom;
      }
      if (action.payload.center) {
        state.center = action.payload.center as [number, number];
      }
      if (action.payload.bounds) {
        state.bounds = action.payload.bounds;
      }
    },
    restorePreviousCenterAndZoom: state => {
      restorePreviousMapBounds(state);
    },
    setBoundaryShape: (state, action: PayloadAction<GeoJsonObject>) => {
      state.boundaryShape = action.payload;
    },
    clearBoundaryShape: state => {
      state.boundaryShape = null;
    },
    setShowSidebar: (state, action: PayloadAction<boolean>) => {
      state.showSidebar = action.payload;
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarWidth = action.payload;
    },
    toggleShowSidebar: state => {
      state.showSidebar = !state.showSidebar;
    },
    setShowCollectionOutline: (state, action: PayloadAction<boolean>) => {
      state.showCollectionOutline = action.payload;
    },
    setUseHighDef: (state, action: PayloadAction<boolean>) => {
      state.useHighDef = action.payload;
    },
    setSidebarPanel: (state, action: PayloadAction<SidebarPanels>) => {
      state.sidebarPanel = action.payload;
      if (action.payload === SidebarPanels.chat) {
        state.sidebarWidth = DEFAULT_SIDEBAR_WIDTH + 100;
      } else {
        state.sidebarWidth = DEFAULT_SIDEBAR_WIDTH;
      }
    },
    setBboxDrawMode: (state, action: PayloadAction<boolean>) => {
      state.isDrawBboxMode = action.payload;

      // Remove existing bbox if drawing mode is turning on
      if (action.payload) {
        state.drawnShape = null;
      }
    },
    setDrawnShape: (state, action: PayloadAction<IDrawnShape | null>) => {
      state.drawnShape = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(
      setShowItemAsDetailLayer,
      (state, action: PayloadAction<boolean>) => {
        if (action.payload) {
          preservePreviousMapBounds(state);
        } else {
          restorePreviousMapBounds(state);
        }
      }
    );

    builder.addCase(
      setItemQuickPreview,
      (state: WritableDraft<MapState>, action) => {
        if (isNull(action.payload.currentIndex)) {
          restorePreviousMapBounds(state);
        } else {
          preservePreviousMapBounds(state);
        }
      }
    );
  },
});

export const {
  setCamera,
  setCenter,
  setZoom,
  restorePreviousCenterAndZoom,
  setBoundaryShape,
  setShowCollectionOutline,
  setUseHighDef,
  clearBoundaryShape,
  toggleShowSidebar,
  setShowSidebar,
  setSidebarWidth,
  setSidebarPanel,
  setBboxDrawMode,
  setDrawnShape,
} = mapSlice.actions;

export default mapSlice.reducer;

const preservePreviousMapBounds = (state: WritableDraft<MapState>) => {
  state.previousCenter = state.center;
  state.previousZoom = state.zoom;
};

const restorePreviousMapBounds = (state: WritableDraft<MapState>) => {
  state.center = state.previousCenter || state.center;
  state.zoom = state.previousZoom || state.zoom;

  clearPreviousMapBounds(state);
};

const clearPreviousMapBounds = (state: WritableDraft<MapState>) => {
  state.previousCenter = state.previousZoom = null;
};
