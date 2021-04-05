import { createSlice } from "@reduxjs/toolkit";

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: {
    url: process.env.REACT_APP_MQE_URL,
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
