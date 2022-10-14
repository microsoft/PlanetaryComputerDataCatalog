import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IStacItem } from "types/stac";
import { removeLayerById } from "./mosaicSlice";

export interface DetailState {
  selectedItem: IStacItem | null;
  showItemAsLayer: boolean;
  isQuickPreviewMode: boolean;
  display: {
    showItemDetail: boolean;
    zoomToItem: boolean;
  };
}

const initialState: DetailState = {
  selectedItem: null,
  showItemAsLayer: false,
  isQuickPreviewMode: false,
  display: {
    showItemDetail: false,
    zoomToItem: false,
  },
};

export const detailSlice = createSlice({
  name: "detail",
  initialState,
  reducers: {
    setItemDetail: (state, action: PayloadAction<IStacItem | null>) => {
      state.selectedItem = action.payload;
      state.display.showItemDetail = true;
    },
    setShowItemAsLayer: (state, action: PayloadAction<boolean>) => {
      state.showItemAsLayer = action.payload;
      state.display.zoomToItem = true;
    },
    setItemQuickPreview: (state, action: PayloadAction<IStacItem | null>) => {
      // Quick preview uses all the detail view logic, but doesn't show the
      // detail view panel or zoom to bounds.
      state.isQuickPreviewMode = true;
      state.selectedItem = action.payload;
      state.display.showItemDetail = false;
      state.showItemAsLayer = true;
      state.display.zoomToItem = false;
    },
    clearSelectedItem: state => {
      state.selectedItem = null;
    },
    resetDetail: () => {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder.addCase(removeLayerById, _ => {
      return initialState;
    });
  },
});

export const {
  resetDetail,
  setItemDetail,
  setItemQuickPreview,
  clearSelectedItem,
  setShowItemAsLayer,
} = detailSlice.actions;

export default detailSlice.reducer;
