export interface IMosaicInfo {
  mosaics: IMosaic[];
  renderOptions: IMosaicRenderOption[] | null;
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
