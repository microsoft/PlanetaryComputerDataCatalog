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

  // Change resulted in same hash, or nothing is being edited, do nothing
  if (
    newSearchId === oldSearchId ||
    newSearchId === state.currentEditingSearchId ||
    !state.currentEditingSearchId
  )
    return;

  // Key the mosaic under the new search id, and update the id
  state.layers[newSearchId] = mosaic;
  state.layers[newSearchId].query.searchId = newSearchId;

  // Remove the old mosaic and update the pointer to the current editing search id
  state.currentEditingSearchId && delete state.layers[state.currentEditingSearchId];
  state.currentEditingSearchId = newSearchId;
};

// Get the current mosaic info as an immer draft object
export const getCurrentMosaicDraft = (state: WritableDraft<IMosaicState>) => {
  if (!state.currentEditingSearchId || !state.layers[state.currentEditingSearchId]) {
    return createDraft(initialLayerState);
  }

  return state.layers[state.currentEditingSearchId];
};
