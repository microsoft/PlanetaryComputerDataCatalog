import { IStacCollection } from "types/stac";

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum ActionTypes {
  mode = "Selected view mode",
  collection = "Selected Collection",
  queryOptions = "Selected mosaic query",
  renderOptions = "Selected render options",
}

export enum ViewerMode {
  mosaic = "mosaic",
  scenes = "scenes",
}

export type State = {
  mode: ViewerMode;
  collection: IStacCollection | null;
  queryName: string | null;
  renderOptions: string | null;
};

type PayloadTypes = {
  [ActionTypes.collection]: IStacCollection;
  [ActionTypes.queryOptions]: string;
  [ActionTypes.renderOptions]: string;
  [ActionTypes.mode]: ViewerMode;
};

export type Actions = ActionMap<PayloadTypes>[keyof ActionMap<PayloadTypes>];

export const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case ActionTypes.mode:
      return { ...state, mode: action.payload };
    case ActionTypes.collection:
      return {
        ...state,
        collection: action.payload,
        mosaicPresetId: null,
        bandsPresetId: null,
      };
    case ActionTypes.queryOptions:
      return { ...state, queryName: action.payload, renderOptions: null };
    case ActionTypes.renderOptions:
      return { ...state, renderOptions: action.payload };
    default:
      return state;
  }
};
