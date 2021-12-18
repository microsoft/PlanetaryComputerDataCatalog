import { LegendTypes } from "./enums";
import { ICqlExpressionList } from "./utils/cql/types";

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
  search: { filter: { and: ICqlExpressionList } };
  orderby: string;
}
