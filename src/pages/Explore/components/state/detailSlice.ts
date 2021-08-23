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
  },
});

export const { setSelectedItem } = detailSlice.actions;

export default detailSlice.reducer;
