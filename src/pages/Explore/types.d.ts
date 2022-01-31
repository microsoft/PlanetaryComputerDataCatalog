import { ICqlExpressionList } from "./utils/cql/types";
import { IStacCollection } from "types/stac";
import { LegendTypes } from "./enums";

export interface IDefaultLocationInfo {
  zoom: number;
  coordinates: [number, number];
}

export interface IMosaicInfo {
  mosaics: IMosaic[];
  renderOptions: IMosaicRenderOption[] | null;
  defaultLocation: IDefaultLocationInfo;
  defaultCustomQuery: ICqlExpressionList;
}

export interface IMosaic {
  name: string | null;
  description: string | null;
  cql: ICqlExpressionList;
  sortby: [] | null;
  searchId?: string | null;
}

export interface IMosaicRenderOption {
  name: string;
  description: string;
  options: string;
  minZoom: number | undefined;
  legend: ILegendConfig | undefined;
}

export interface ILegendConfig {
  type?: LegendTypes;
  labels?: string[];
  trimStart?: number;
  trimEnd?: number;
}

export interface IMapInfo {
  initialCoords: [number, number];
  initialZoom: number;
}

export interface IQueryable {
  properties: { [key: string]: any };
}

export interface ISearchIdMetadata {
  hash: string;
  search: { filter: { args: ICqlExpressionList } };
  orderby: string;
}

export interface ILayerState {
  layerId: string;
  collection: IStacCollection | null;
  query: IMosaic;
  isCustomQuery: boolean;
  isPinned: boolean;
  renderOption: IMosaicRenderOption | null;
  layer: {
    minZoom: number;
    maxExtent: number[];
    opacity: number;
  };
}

export type CurrentLayers = Record<string, ILayerState>;
export interface IMosaicState {
  layers: CurrentLayers;
  layerOrder: string[];
  currentEditingLayerId: string | null;
}
