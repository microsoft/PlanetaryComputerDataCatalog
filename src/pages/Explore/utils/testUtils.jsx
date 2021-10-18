import React from "react";
import { configure, render as rtlRender } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import mosaicReducer from "../state/mosaicSlice";
function render(
  ui,
  {
    preloadedState,
    store = configureStore({ reducer: { mosaic: mosaicReducer }, preloadedState }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

configure({ testIdAttribute: "data-cy" });

// re-export everything
export * from "@testing-library/react";
// override render method
export { render };
