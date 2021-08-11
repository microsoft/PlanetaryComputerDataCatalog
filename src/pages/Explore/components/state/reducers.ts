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
  dataset = "Selected Collection Id",
  mode = "Selected view mode",
  mosaic = "Selected mosaic id",
  bands = "Selected band combination id",
}

export enum ViewerMode {
  mosaic = "mosaic",
  scenes = "scenes",
}

export type State = {
  selectedDataset: string | null;
  mode: ViewerMode;
  mosaicPresetId: string | null;
  bandsPresetId: string | null;
};

type PayloadTypes = {
  [ActionTypes.dataset]: string;
  [ActionTypes.mosaic]: string;
  [ActionTypes.bands]: string;
  [ActionTypes.mode]: ViewerMode;
};

export type Actions = ActionMap<PayloadTypes>[keyof ActionMap<PayloadTypes>];

export const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case ActionTypes.dataset:
      return { ...state, selectedDataset: action.payload };
    case ActionTypes.mode:
      return { ...state, mode: action.payload };
    case ActionTypes.mosaic:
      return { ...state, mosaicPresetId: action.payload };
    case ActionTypes.bands:
      return { ...state, bandsPresetId: action.payload };
    default:
      return state;
  }
};
