export interface IDefaultLocationInfo {
  zoom: number;
  coordinates: [number, number];
}
export interface IMosaicInfo {
  mosaics: IMosaic[];
  renderOptions: IMosaicRenderOption[] | null;
  defaultLocation: IDefaultLocationInfo;
}

export interface IMosaic {
  name: string | null;
  description: string | null;
  cql: [] | null;
  sortby: [] | null;
  hash?: string | null;
}

export interface IMosaicRenderOption {
  name: string;
  description: string;
  options: string;
  minZoom: number | undefined;
}

export interface IMapInfo {
  initialCoords: [number, number];
  initialZoom: number;
}
