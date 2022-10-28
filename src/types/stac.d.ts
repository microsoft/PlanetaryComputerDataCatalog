import { Feature, FeatureCollection, Geometry } from "geojson";
import { ICqlExpressionList } from "pages/Explore/utils/cql/types";

export interface IPcCollection {
  id: string;
  title: string;
  description: string;
  summaries?: Record<string, Optional<[]>>;
  assets?: Record<string, IStacAsset>;
  item_assets?: Record<string, IStacAsset>;
  keywords: string[];
  providers?: IStacProvider[];
  "msft:short_description": string;
  "msft:group_id"?: string;
  "cube:variables"?: Record<string, Record<string, any>>;
}

export interface IStacCollection extends IPcCollection {
  license: string;
  extent: {
    spatial: {
      bbox: Array<Array<number>>;
    };
    temporal: {
      interval: Array<Array<string | null>>;
    };
  };
  item_assets: Record<string, IStacAsset>;
  assets: Record<string, IStacAsset>;
  links: IStacLink[];
  "msft:requires_account"?: boolean;
}

export interface IStacProvider {
  name: string;
  url: string;
  roles: string[];
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
  "classification:classes"?: ClassificationExtClasses[];
}

export interface FileExtValues {
  values: number[];
  summary: string;
}

export interface ClassificationExtClasses {
  value: number;
  description: string;
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

export interface IStacExtension {
  label: string;
  extension: string;
  properties: Record<string, any>;
}
