import { createSlice } from "@reduxjs/toolkit";
import { MQE_URL } from "../../utils/constants";

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: {
    url: MQE_URL,
  },
  reducers: {
    updateUrl: (state, action) => {
      state.url = action.payload;
    },
  },
});

// Actions
export const { updateUrl } = catalogSlice.actions;

// Selectors
export const selectUrl = state => state.catalog.url;

export default catalogSlice.reducer;
