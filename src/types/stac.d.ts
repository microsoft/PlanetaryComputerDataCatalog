import { Feature, FeatureCollection, Geometry } from "geojson";

export interface IStacCollection {
  id: string;
  title: string;
  description: string;
  license: string;
  assets: Record<string, IStacAsset>;
  item_assets: Record<string, IStacAsset>;
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
  "msft:short_description": string;
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
  links: IStacLink[];
}

export interface IStacAsset {
  href: string;
  title?: string;
  description?: string;
  type?: string;
  roles?: string[];
}

export interface IStacFilter {
  filter: Record<string, any>;
  limit?: number;
}

export interface IStacFilterCollection {
  eq: [{ property: "collection" }, string];
}

export interface IStacFilterGeom {
  intersects: [{ property: "geometry" }, Geometry];
}

export interface IStacSearchResult extends FeatureCollection {
  features: IStacItem[];
  links: IStacLink[];
  numberMatched: number;
  numberReturned: number;
  context?: {
    limit: number;
    matched: number;
    returned: number;
  };
}
