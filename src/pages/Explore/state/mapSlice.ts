import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as atlas from "azure-maps-control";
import { GeoJsonObject } from "geojson";
import { getCenterAndZoomQueryString } from "../utils";
import { setShowAsLayer } from "./detailSlice";

const { center, zoom } = getCenterAndZoomQueryString();

export interface MapState {
  center: [number, number];
  zoom: number;
  bounds: atlas.data.BoundingBox | null;
  boundaryShape: GeoJsonObject | null;
  showCollectionOutline: boolean;
  showSidebar: boolean;
  previousCenter: [number, number] | null;
  previousZoom: number | null;
}

const initialState: MapState = {
  center: center || [30, 30],
  zoom: zoom || 2,
  bounds: null,
  boundaryShape: null,
  showCollectionOutline: true,
  showSidebar: true,
  previousCenter: null,
  previousZoom: null,
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
  },
  extraReducers: builder => {
    builder.addCase(setShowAsLayer, (state, action: PayloadAction<boolean>) => {
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
  clearBoundaryShape,
  toggleShowSidebar,
} = mapSlice.actions;

export default mapSlice.reducer;
