import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnimationResponse } from "../components/Sidebar/AnimationExporter/AnimationResult";
import { AnimationFrameSettings } from "../components/Sidebar/AnimationExporter/types";
import { ExploreState } from "./store";

export interface AnimationState {
  animations: Record<string, AnimationResponse[]>;
  settings: Record<string, AnimationFrameSettings>;
}

export interface CollectionAnimation {
  collectionId: string;
  animation: AnimationResponse;
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
    addAnimation: (state, action: PayloadAction<CollectionAnimation>) => {
      const collectionAnimations =
        state.animations[action.payload.collectionId] || [];
      collectionAnimations.push(action.payload.animation);
      state.animations[action.payload.collectionId] = collectionAnimations;
    },

    removeAnimation: (state, action: PayloadAction<CollectionAnimation>) => {
      const collectionAnimations =
        state.animations[action.payload.collectionId] || [];

      const index = collectionAnimations.findIndex(
        a => a.url === action.payload.animation.url
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
