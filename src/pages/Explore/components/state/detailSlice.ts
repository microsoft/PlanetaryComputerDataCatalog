import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IStacItem } from "types/stac";

export interface DetailState {
  selectedItem: IStacItem | null;
}

const initialState: DetailState = {
  selectedItem: null,
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
  },
});

export const { setSelectedItem, clearSelectedItem } = detailSlice.actions;

export default detailSlice.reducer;
