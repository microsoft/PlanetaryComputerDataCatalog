import { Feature, FeatureCollection, Geometry } from "geojson";
import { ICqlExpressionList } from "pages/Explore/utils/cql/types";

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
      interval: Array<Array<string | null>>;
    };
  };
  keywords: string[];
  links: IStacLink[];
  "msft:short_description": string;
  "msft:group_id"?: string;
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
  "file:values"?: FileExtValues[];
}

export interface FileExtValues {
  values: number[];
  summary: string;
}
export interface IStacFilter {
  filter: { op: "and"; args: ICqlExpressionList };
  limit?: number;
}

export interface IStacFilterCollection {
  op: "=";
  args: [{ property: "collection" }, string];
}

export interface IStacFilterGeom {
  op: "s_intersects";
  args: [{ property: "geometry" }, Geometry];
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
