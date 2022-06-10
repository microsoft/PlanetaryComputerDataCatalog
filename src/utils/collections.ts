import { BBox, Feature, GeoJsonProperties, MultiPolygon, Polygon } from "geojson";
import bboxToPolygon from "@turf/bbox-polygon";
import union from "@turf/union";
import { IStacCollection } from "types/stac";
import collections from "config/datasets.yml";

export const spatialExtentToMultipolygon = (bbox: number[][]) => {
  const polys = bbox.map(box => bboxToPolygon(box as BBox));

  const multiPoly = polys.reduce<Feature<
    Polygon | MultiPolygon,
    GeoJsonProperties
  > | null>((unionedPoly, currPoly) => {
    if (unionedPoly) {
      return union(unionedPoly.geometry, currPoly.geometry);
    }
    // base case
    return currPoly;
  }, null);

  return multiPoly;
};

export const isValidExplorer = (collection: IStacCollection) => {
  // By default, all collections with at least one GeoTIFF data-role item_asset
  // are renderable. Collections can be restricted from explorer via a hideInExplorer
  // attribute in the dataset config.
  if (collection.item_assets) {
    const hasCOG = !!Object.values(collection.item_assets).find(a =>
      a.type?.toLowerCase().includes("geotiff")
    );
    const isHidden = Boolean(collections[collection.id]?.hideInExplorer);

    return hasCOG && !isHidden;
  }
  return false;
};
