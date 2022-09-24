import * as atlas from "azure-maps-control";
import dayjs, { ManipulateType } from "dayjs";
import { IAnimationHint, IDrawnShape, ILayerState } from "pages/Explore/types";
import { DEFAULT_MIN_ZOOM } from "pages/Explore/utils/constants";
import { IStacCollection } from "types/stac";
import { ImageConfig, ImageSettings, ImageValidation } from "./types";

const MAX_FRAMES = 24;

export const validate = (
  imageConfig: ImageConfig,
  collection: IStacCollection | null,
  layer: ILayerState["layer"] | null,
  drawnShape: IDrawnShape | null
) => {
  const { cols, rows, imageSize, zoom } = imageConfig;
  const validations: ImageValidation = {
    start: [],
    frames: [],
    duration: [],
    step: [],
    map: [],
    isValid: false,
  };

  if (!cols) {
    validations.frames.push("Required.");
  }

  if (!rows) {
    validations.frames.push("Required.");
  }

  if (zoom < (layer?.minZoom || DEFAULT_MIN_ZOOM)) {
    validations.map.push("Zoom in to see layer.");
  }

  if (!drawnShape) {
    validations.map.push("Please draw an export area on the map.");
  }

  validations.isValid =
    Object.values(validations).reduce(
      (acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0),
      0
    ) === 0;

  return validations;
};

export const getDefaultImageSettings = (): ImageSettings => ({
  cols: 1280,
  rows: 720,
  imageSize: "1280x720",
  showBranding: true,
});
