import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MapState {
  center: [number, number];
  zoom: number;
}

const initialState: MapState = {
  center: [30, 30],
  zoom: 2,
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
  },
});

export const { setCenter, setZoom } = mapSlice.actions;

export default mapSlice.reducer;
