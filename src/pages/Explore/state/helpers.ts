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
  mosaic.query.searchId = newSearchId;
};

// Get the current mosaic info as an immer draft object
export const getCurrentMosaicDraft = (state: WritableDraft<IMosaicState>) => {
  if (!state.currentEditingLayerId || !state.layers[state.currentEditingLayerId]) {
    return createDraft(initialLayerState);
  }

  return state.layers[state.currentEditingLayerId];
};
