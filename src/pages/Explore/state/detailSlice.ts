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
    setShowAsLayer: (state, action: PayloadAction<boolean>) => {
      state.showAsLayer = action.payload;
    },
    resetDetail: () => {
      return initialState;
    },
  },
});

export const { resetDetail, setSelectedItem, clearSelectedItem, setShowAsLayer } =
  detailSlice.actions;

export default detailSlice.reducer;
