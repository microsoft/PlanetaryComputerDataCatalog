import { ICqlExpressionList } from "./utils/cql/types";
import { IStacCollection, IStacLink } from "types/stac";
import { LegendTypes } from "./enums";

export interface IDefaultLocationInfo {
  zoom: number;
  coordinates: [number, number];
}

export interface IAnimationHint {
  unit: string;
  step: number;
  duration: number;
  frameCount: number;
}
export interface IMosaicInfo {
  mosaics: IMosaic[];
  renderOptions: IMosaicRenderOption[] | null;
  defaultLocation: IDefaultLocationInfo;
  defaultCustomQuery: ICqlExpressionList;
  animationHint: IAnimationHint | undefined;
}

export interface IMosaic {
  name: string | null;
  description: string | null;
  cql: ICqlExpressionList;
  sortby: [] | null;
  searchId?: string | null;
}

export interface IMosaicRenderOptionCondition {
  property: string;
  value: any;
}
export interface IMosaicRenderOption {
  name: string;
  description: string;
  options: string;
  minZoom: number | undefined;
  legend: ILegendConfig | undefined;
  conditions?: IMosaicRenderOptionCondition[];
}

export interface ILegendConfig {
  type?: LegendTypes;
  labels?: string[];
  trimStart?: number;
  trimEnd?: number;
  scaleFactor?: number;
}

export interface IMapInfo {
  initialCoords: [number, number];
  initialZoom: number;
}

export interface IQueryable {
  properties: { [key: string]: any };
}

export interface ISearchIdMetadata {
  links: IStacLink[];
  metadata: { type: string };
  orderby: string;
  search: {
    hash: string;
    search: { filter: { args: ICqlExpressionList } };
    orderby: string;
  };
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
    visible: boolean;
  };
}

export type CurrentLayers = Record<string, ILayerState>;
export interface IMosaicState {
  layers: CurrentLayers;
  layerOrder: string[];
  currentEditingLayerId: string | null;
  isLoadingInitialState: Boolean;
}

export interface IOrderedLayers {
  layers: CurrentLayers;
  layerOrder: string[];
}

export interface ILayerZoomVisibility {
  current: ILayerState | null;
  others: ILayerState[];
}
