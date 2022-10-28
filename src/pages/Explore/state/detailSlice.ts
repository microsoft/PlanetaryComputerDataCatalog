import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isNull } from "lodash-es";
import { IStacItem } from "types/stac";
import { removeLayerById } from "./mosaicSlice";

export interface DetailState {
  selectedItem: IStacItem | null;
  display: {
    showSelectedItemAsLayer: boolean;
    showItemDetailsPanel: boolean;
    zoomToItem: boolean;
  };
  previewMode: {
    enabled: boolean;
    currentIndex: number | null;
    items: IStacItem[];
  };
}

const initialState: DetailState = {
  selectedItem: null,
  display: {
    showSelectedItemAsLayer: false,
    showItemDetailsPanel: false,
    zoomToItem: false,
  },
  previewMode: {
    enabled: false,
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

      if (state.previewMode.enabled) {
        state.previewMode.currentIndex = state.previewMode.items.findIndex(
          i => i.id === action.payload?.id
        );
      }
    },
    setItemDetail: (state, action: PayloadAction<IStacItem | null>) => {
      state.selectedItem = action.payload;
      state.display.showItemDetailsPanel = true;
    },
    setShowItemAsDetailLayer: (state, action: PayloadAction<boolean>) => {
      state.display.zoomToItem = true;
      state.display.showSelectedItemAsLayer = action.payload;
    },
    setItemQuickPreview: (state, action: PayloadAction<previewModePayload>) => {
      const { currentIndex, items } = action.payload;
      // Quick preview uses all the detail view logic, but doesn't show the
      // detail view panel or zoom to bounds.
      state.previewMode.enabled = true;
      state.selectedItem = isNull(currentIndex)
        ? null
        : action.payload.items[currentIndex];
      state.previewMode.items = items;
      state.previewMode.currentIndex = currentIndex;

      state.display.showSelectedItemAsLayer = true;

      // Don't zoom to the item or show the detail panel
      state.display.showItemDetailsPanel = false;
      state.display.zoomToItem = false;
    },
    setNextItemPreview: state => {
      if (isNull(state.previewMode.currentIndex)) return;

      const nextIndex = state.previewMode.currentIndex + 1;
      if (state.previewMode.items.length > nextIndex) {
        state.selectedItem = state.previewMode.items[nextIndex];
        state.previewMode.currentIndex = nextIndex;
      }
    },
    setPrevItemPreview: state => {
      if (isNull(state.previewMode.currentIndex)) return;

      const prevIndex = state.previewMode.currentIndex - 1;
      if (prevIndex >= 0) {
        state.selectedItem = state.previewMode.items[prevIndex];
        state.previewMode.currentIndex = prevIndex;
      }
    },
    clearDetailView: state => {
      // The item will remain selected if preview mode is enabled
      if (!state.previewMode.enabled) {
        state.selectedItem = null;
        state.display.showSelectedItemAsLayer = false;
      }
      state.display.showItemDetailsPanel = false;
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
