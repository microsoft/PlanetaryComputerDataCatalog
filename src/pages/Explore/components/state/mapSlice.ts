import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as atlas from "azure-maps-control";
import { GeoJsonObject } from "geojson";

export interface MapState {
  center: [number, number];
  zoom: number;
  bounds: atlas.data.BoundingBox;
  boundaryShape: GeoJsonObject | null;
}

const initialState: MapState = {
  center: [30, 30],
  zoom: 2,
  bounds: [-180, -89, 180, 90],
  boundaryShape: null,
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
  },
});

export const {
  setCamera,
  setCenter,
  setZoom,
  setBoundaryShape,
  clearBoundaryShape,
} = mapSlice.actions;

export default mapSlice.reducer;
