import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnimationResponse } from "../components/Sidebar/AnimationExporter/AnimationResult";
import { ExploreState } from "./store";

export interface AnimationState {
  animations: Record<string, AnimationResponse[]>;
}

export interface CollectionAnimation {
  collectionId: string;
  animation: AnimationResponse;
}

const initialState: AnimationState = {
  animations: {},
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
  },
});

export const { addAnimation, removeAnimation } = animationSlice.actions;
export default animationSlice.reducer;

// Custom selector to get all pinned mosaic layers
const selectAnimations = (state: ExploreState) => state.animation;
const selectCollectionAnimations = (
  state: ExploreState,
  collectionId: string | undefined
) => collectionId;

export const selectAnimationsByCollection = createSelector(
  [selectAnimations, selectCollectionAnimations],
  (animations, collectionId) => {
    return (collectionId && animations.animations[collectionId]) || [];
  }
);
