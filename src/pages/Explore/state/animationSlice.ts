import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnimationFrameSettings } from "../components/Sidebar/exporters/AnimationExporter/types";
import { ImageExportResponse } from "../components/Sidebar/exporters/BaseExporter/types";
import { CollectionImageExport } from "./imageSlice";
import { ExploreState } from "./store";

export interface AnimationState {
  animations: Record<string, ImageExportResponse[]>;
  settings: Record<string, AnimationFrameSettings>;
}

export interface CollectionAnimationConfig {
  collectionId: string;
  animationSettings: AnimationFrameSettings;
}

const initialState: AnimationState = {
  animations: {},
  settings: {},
};

export const animationSlice = createSlice({
  name: "animations",
  initialState,
  reducers: {
    addAnimation: (state, action: PayloadAction<CollectionImageExport>) => {
      const collectionAnimations =
        state.animations[action.payload.collectionId] || [];
      collectionAnimations.push(action.payload.image);
      state.animations[action.payload.collectionId] = collectionAnimations;
    },

    removeAnimation: (state, action: PayloadAction<CollectionImageExport>) => {
      const collectionAnimations =
        state.animations[action.payload.collectionId] || [];

      const index = collectionAnimations.findIndex(
        a => a.url === action.payload.image.url
      );
      if (index > -1) {
        collectionAnimations.splice(index, 1);
      }
      state.animations[action.payload.collectionId] = collectionAnimations;
    },

    updateAnimationSettings: (
      state,
      action: PayloadAction<CollectionAnimationConfig>
    ) => {
      state.settings[action.payload.collectionId] = action.payload.animationSettings;
    },
  },
});

export const { addAnimation, removeAnimation, updateAnimationSettings } =
  animationSlice.actions;
export default animationSlice.reducer;

// Custom selector to get all pinned mosaic layers
const selectAnimationState = (state: ExploreState) => state.animation;
const selectCollectionAnimations = (
  state: ExploreState,
  collectionId: string | undefined
) => collectionId;

export const selectAnimationsByCollection = createSelector(
  [selectAnimationState, selectCollectionAnimations],
  (animations, collectionId) => {
    return (collectionId && animations.animations[collectionId]) || [];
  }
);

export const selectAnimationFrameSettings = createSelector(
  [selectAnimationState, selectCollectionAnimations],
  (animations, collectionId) => {
    return animations.settings[collectionId || ""] || {};
  }
);
