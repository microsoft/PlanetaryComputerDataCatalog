import { WritableDraft } from "immer/dist/internal";
import { createDraft } from "immer";
import { IMosaicState } from "../types";
import { initialLayerState } from "./mosaicSlice";

export const updateSearchId = (
  state: WritableDraft<IMosaicState>,
  newSearchId: string
) => {
  // After the search has been updated, update the current layer with the new search id
  const mosaic = getCurrentMosaicDraft(state);
  const oldSearchId = mosaic.query.searchId;

  // Change resulted in same hash, do nothing
  if (newSearchId === oldSearchId) return;

  mosaic.query.searchId = newSearchId;
  state.layers[newSearchId] = mosaic;
  oldSearchId && delete state.layers[oldSearchId];
  state.currentEditingSearchId = newSearchId;
};

// Get the current mosaic info as an immer draft object
export const getCurrentMosaicDraft = (state: WritableDraft<IMosaicState>) => {
  if (!state.currentEditingSearchId || !state.layers[state.currentEditingSearchId]) {
    return createDraft(initialLayerState);
  }

  return state.layers[state.currentEditingSearchId];
};
