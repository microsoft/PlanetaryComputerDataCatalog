import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ImageExportResponse } from "../components/Sidebar/exporters/BaseExporter/types";
import { ImageSettings } from "../components/Sidebar/exporters/ImageExporter/types";
import { ExploreState } from "./store";

export interface ImageState {
  images: Record<string, ImageExportResponse[]>;
  settings: Record<string, ImageSettings>;
}

export interface CollectionImageExport {
  collectionId: string;
  image: ImageExportResponse;
}

export interface CollectionImageConfig {
  collectionId: string;
  imageSettings: ImageSettings;
}

const initialState: ImageState = {
  images: {},
  settings: {},
};

export const ImageSlice = createSlice({
  name: "Images",
  initialState,
  reducers: {
    addImage: (state, action: PayloadAction<CollectionImageExport>) => {
      const collectionImages = state.images[action.payload.collectionId] || [];
      collectionImages.push(action.payload.image);
      state.images[action.payload.collectionId] = collectionImages;
    },

    removeImage: (state, action: PayloadAction<CollectionImageExport>) => {
      const collectionImages = state.images[action.payload.collectionId] || [];

      const index = collectionImages.findIndex(
        a => a.url === action.payload.image.url
      );
      if (index > -1) {
        collectionImages.splice(index, 1);
      }
      state.images[action.payload.collectionId] = collectionImages;
    },

    updateImageSettings: (state, action: PayloadAction<CollectionImageConfig>) => {
      state.settings[action.payload.collectionId] = action.payload.imageSettings;
    },
  },
});

export const { addImage, removeImage, updateImageSettings } = ImageSlice.actions;
export default ImageSlice.reducer;

// Custom selector to get all pinned mosaic layers
const selectImageState = (state: ExploreState) => state.image;
const selectCollectionImages = (
  state: ExploreState,
  collectionId: string | undefined
) => collectionId;

export const selectImagesByCollection = createSelector(
  [selectImageState, selectCollectionImages],
  (Images, collectionId) => {
    return (collectionId && Images.images[collectionId]) || [];
  }
);

export const selectImageSettings = createSelector(
  [selectImageState, selectCollectionImages],
  (Images, collectionId) => {
    return Images.settings[collectionId || ""] || {};
  }
);
