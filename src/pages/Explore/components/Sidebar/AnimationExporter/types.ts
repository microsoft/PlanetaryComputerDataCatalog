import { IStacFilter } from "types/stac";
export interface AnimationFrameSettings {
  start: string;
  step: number;
  unit: string;
  frames: number;
  duration: number;
  showProgressBar: boolean;
  showBranding: boolean;
}

export interface AnimationMosaicSettings {
  bbox: number[] | null;
  zoom: number;
  cql: IStacFilter;
  render_params: string;
}

export type AnimationConfig = AnimationFrameSettings & AnimationMosaicSettings;

export interface AnimationValidation {
  start: string[];
  step: string[];
  frames: string[];
  duration: string[];
  map: string[];
  isValid: boolean;
}
