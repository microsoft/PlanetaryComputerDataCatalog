import * as atlas from "azure-maps-control";
import dayjs, { ManipulateType } from "dayjs";
import { ILayerState } from "pages/Explore/types";
import { DEFAULT_MIN_ZOOM } from "pages/Explore/utils/constants";
import { IStacCollection } from "types/stac";
import {
  AnimationConfig,
  AnimationFrameSettings,
  AnimationValidation,
} from "./types";

const MAX_FRAMES = 24;

export const validate = (
  animationConfig: AnimationConfig,
  collection: IStacCollection | null,
  layer: ILayerState["layer"] | null,
  drawnBbox: atlas.data.BoundingBox | null
) => {
  const { start, step, unit, frames, duration, zoom } = animationConfig;
  const validations: AnimationValidation = {
    start: [],
    frames: [],
    duration: [],
    step: [],
    map: [],
    isValid: false,
  };

  const startDate = dayjs(start);

  const collectionStart = getCollectionStart(collection);
  const collectionEnd = getCollectionEnd(collection);

  if (!start) {
    validations.start.push("Required.");
  }

  if (!startDate.isValid()) {
    validations.start.push("Invalid datetime.");
  }

  if (!step) {
    validations.step.push("Required.");
  }

  if (!frames) {
    validations.frames.push("Required.");
  }

  if (frames > MAX_FRAMES) {
    validations.frames.push(`Max ${MAX_FRAMES} frames.`);
  }

  if (!duration) {
    validations.duration.push("Required.");
  }

  if (frames < 2) {
    validations.frames.push("Must be > 2.");
  }

  if (duration < 10) {
    validations.duration.push("Must be > 10ms.");
  }

  if (step < 1) {
    validations.step.push("Must be > 1.");
  }

  if (startDate.isBefore(collectionStart)) {
    validations.start.push(`Must be after ${collectionStart.format("YYYY-MM-DD")}`);
  }

  if (startDate.add(step * frames, unit as ManipulateType).isAfter(collectionEnd)) {
    validations.frames.push(
      `Frames go past dataset end date of ${collectionEnd.format("YYYY-MM-DD")}`
    );
  }

  if (zoom < (layer?.minZoom || DEFAULT_MIN_ZOOM)) {
    validations.map.push("Zoom in to see layer.");
  }

  if (!drawnBbox) {
    validations.map.push("Please draw an export area on the map.");
  }

  validations.isValid =
    Object.values(validations).reduce(
      (acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0),
      0
    ) === 0;

  return validations;
};

const getCollectionStart = (collection: IStacCollection | null) => {
  if (!collection) {
    return dayjs();
  }
  const temporal = collection.extent.temporal.interval;
  const collectionStart = temporal.reduce((acc, curr) => {
    if (dayjs(acc).isBefore(dayjs(curr[0]))) {
      return acc;
    }
    return curr[0];
  }, temporal[0][0]);
  return dayjs(collectionStart);
};

const getCollectionEnd = (collection: IStacCollection | null) => {
  if (!collection) {
    return dayjs();
  }
  const temporal = collection.extent.temporal.interval;
  const collectionEnd = temporal.reduce((acc, curr) => {
    if (dayjs(acc).isAfter(dayjs(curr[1]))) {
      return acc;
    }
    return curr[1];
  }, temporal[0][1]);

  return collectionEnd ? dayjs(collectionEnd) : dayjs();
};

export const getDefaultSettings = (collection: IStacCollection | null) => {
  const collectionStart = getCollectionStart(collection);
  const collectionEnd = getCollectionEnd(collection);

  const diff = collectionEnd.diff(collectionStart, "d") / 2;
  const defaultStart = collectionStart.add(diff, "d").startOf("d").toISOString();
  const defaultSettings: AnimationFrameSettings = {
    start: defaultStart,
    step: 1,
    unit: "months",
    frames: 6,
    duration: 250,
    showBranding: true,
    showProgressBar: true,
  };

  return defaultSettings;
};

export const isValidCollection = (collection: IStacCollection | null) => {
  if (!collection) {
    return false;
  }

  // If the start/end dates of the temporal extent are the same, then the collection is invalid.
  const temporal = collection.extent.temporal.interval;
  return temporal
    .map(([start, end]) => dayjs(start).isSame(dayjs(end)))
    .every(Boolean);
};
