import React, { createContext, useReducer } from "react";
import { reducer, State, ViewerMode } from "./reducers";

type Props = {
  children: React.ReactNode;
};

const initialState: State = {
  selectedDataset: null,
  mode: ViewerMode.mosaic,
  mosaicPresetId: null,
  bandsPresetId: null,
};

export const ExploreContext = createContext<{
  state: State;
  dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => null });

export const ExploreProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ExploreContext.Provider value={{ state, dispatch }}>
      {children}
    </ExploreContext.Provider>
  );
};
