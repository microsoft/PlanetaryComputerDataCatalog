export interface IAnnouncementType {
  id: string;
  startDate: string;
  endDate: string;
  content: string;
}

export interface IMosaicInfo {
  mosaics: IMosaic[];
}

export interface IMosaic {
  name: string | null;
  description: string | null;
  cql: string | null;
  renderOptions: IMosaicRenderOption[] | null;
}

export interface IMosaicRenderOption {
  name: string;
  description: string;
  options: string;
}
