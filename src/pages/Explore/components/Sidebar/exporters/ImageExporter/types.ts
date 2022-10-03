import atlas from "azure-maps-control";
import { IStacFilter } from "types/stac";

export interface ImageSettings {
  imageSize: string;
  cols: number;
  rows: number;
  showBranding: boolean;
}

export interface ImageMosaicSettings {
  geometry: atlas.data.Geometry | null;
  zoom: number;
  cql: IStacFilter;
  render_params: string;
}

export type ImageConfig = ImageSettings & ImageMosaicSettings;

export type ImageExportRequest = {
  geometry: atlas.data.Geometry | null;
  cql: IStacFilter;
  render_params: string;
  cols: number;
  rows: number;
  showBranding: boolean;
};

export interface ImageValidation {
  start: string[];
  step: string[];
  frames: string[];
  duration: string[];
  map: string[];
  isValid: boolean;
}
