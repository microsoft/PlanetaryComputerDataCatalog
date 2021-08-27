import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IStacItem } from "types/stac";

export interface DetailState {
  selectedItem: IStacItem | null;
  showAsLayer: boolean;
}

const initialState: DetailState = {
  selectedItem: null,
  showAsLayer: false,
};

export const detailSlice = createSlice({
  name: "detail",
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<IStacItem | null>) => {
      state.selectedItem = action.payload;
    },
    clearSelectedItem: state => {
      state.selectedItem = null;
    },
    toggleShowAsLayer: state => {
      state.showAsLayer = !state.showAsLayer;
    },
    setShowAsLayer: (state, action: PayloadAction<boolean>) => {
      state.showAsLayer = action.payload;
    },
  },
});

export const {
  setSelectedItem,
  clearSelectedItem,
  toggleShowAsLayer,
  setShowAsLayer,
} = detailSlice.actions;

export default detailSlice.reducer;
