import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as atlas from "azure-maps-control";
import { GeoJsonObject } from "geojson";
import { SidebarPanels } from "../enums";
import { IDrawnShape } from "../types";
import { getCenterAndZoomQueryString } from "../utils";
import { setShowItemAsLayer } from "./detailSlice";

const { center, zoom } = getCenterAndZoomQueryString();

export interface MapState {
  center: [number, number];
  zoom: number;
  bounds: atlas.data.BoundingBox | null;
  boundaryShape: GeoJsonObject | null;
  showCollectionOutline: boolean;
  showSidebar: boolean;
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
    setBoundaryShape: (state, action: PayloadAction<GeoJsonObject>) => {
      state.boundaryShape = action.payload;
    },
    clearBoundaryShape: state => {
      state.boundaryShape = null;
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
    builder.addCase(setShowItemAsLayer, (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.previousCenter = state.center;
        state.previousZoom = state.zoom;
      } else {
        state.center = state.previousCenter || state.center;
        state.zoom = state.previousZoom || state.zoom;

        //Reset
        state.previousCenter = state.previousZoom = null;
      }
    });
  },
});

export const {
  setCamera,
  setCenter,
  setZoom,
  setBoundaryShape,
  setShowCollectionOutline,
  setUseHighDef,
  clearBoundaryShape,
  toggleShowSidebar,
  setSidebarPanel,
  setBboxDrawMode,
  setDrawnShape,
} = mapSlice.actions;

export default mapSlice.reducer;
