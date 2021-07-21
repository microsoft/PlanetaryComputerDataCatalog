import { Feature, FeatureCollection } from "geojson";

export interface IStacCollection {
  id: string;
  title: string;
  description: string;
  license: string;
  assets: Record<string, IStacAsset>;
  extent: {
    spatial: {
      bbox: Array<Array<number>>;
    };
    temporal: {
      interval: Array<Array<string>>;
    };
  };
  keywords: string[];
  links: IStacLink[];
}

export interface IStacLink {
  href: string;
  rel: string;
  title?: string;
  type?: string;
}

export interface IStacItem extends Feature {
  collection: string;
  assets: { [key: string]: IStacAsset };
}

export interface IStacAsset {
  href: string;
  title?: string;
  description?: string;
  type?: string;
  roles?: string[];
}

export interface IStacSearch {
  collections: string[];
  bbox: [number, number, number, number];
  limit: number;
  datetime: string;
  items?: string[];
}

export interface IStacSearchResult extends FeatureCollection {
  features: IStacItem[];
  numberMatched: number;
  numberReturned: number;
  context: {
    limit: number;
    matched: number;
    returned: number;
  };
}
