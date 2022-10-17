import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isNull } from "lodash-es";
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
  previewModeNav: {
    currentIndex: number | null;
    items: IStacItem[];
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
  previewModeNav: {
    currentIndex: null,
    items: [],
  },
};

export type previewModePayload = {
  items: IStacItem[];
  currentIndex: number | null;
};

export const detailSlice = createSlice({
  name: "detail",
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<IStacItem | null>) => {
      state.selectedItem = action.payload;

      state.previewModeNav.currentIndex = state.previewModeNav.items.findIndex(
        i => i.id === action.payload?.id
      );
    },
    setItemDetail: (state, action: PayloadAction<IStacItem | null>) => {
      state.selectedItem = action.payload;
      state.display.showItemDetail = true;
    },
    setShowItemAsDetailLayer: (state, action: PayloadAction<boolean>) => {
      state.showItemAsLayer = action.payload;
      state.display.zoomToItem = true;
    },
    setItemQuickPreview: (state, action: PayloadAction<previewModePayload>) => {
      const { currentIndex, items } = action.payload;
      // Quick preview uses all the detail view logic, but doesn't show the
      // detail view panel or zoom to bounds.
      state.isQuickPreviewMode = true;
      state.selectedItem = isNull(currentIndex)
        ? null
        : action.payload.items[currentIndex];
      state.previewModeNav.items = items;
      state.previewModeNav.currentIndex = currentIndex;

      state.showItemAsLayer = true;

      // Don't zoom to the item or show the detail panel
      state.display.showItemDetail = false;
      state.display.zoomToItem = false;
    },
    setNextItemPreview: state => {
      if (isNull(state.previewModeNav.currentIndex)) return;

      const nextIndex = state.previewModeNav.currentIndex + 1;
      if (state.previewModeNav.items.length > nextIndex) {
        state.selectedItem = state.previewModeNav.items[nextIndex];
        state.previewModeNav.currentIndex = nextIndex;
      }
    },
    setPrevItemPreview: state => {
      if (isNull(state.previewModeNav.currentIndex)) return;

      const prevIndex = state.previewModeNav.currentIndex - 1;
      if (prevIndex >= 0) {
        state.selectedItem = state.previewModeNav.items[prevIndex];
        state.previewModeNav.currentIndex = prevIndex;
      }
    },
    clearDetailView: state => {
      // The item will remain selected if preview mode is enabled
      if (!state.isQuickPreviewMode) {
        state.showItemAsLayer = false;
        state.selectedItem = null;
      }
      state.display.showItemDetail = false;
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
  setSelectedItem,
  setItemDetail,
  setItemQuickPreview,
  setNextItemPreview,
  setPrevItemPreview,
  clearDetailView,
  setShowItemAsDetailLayer,
} = detailSlice.actions;

export default detailSlice.reducer;
