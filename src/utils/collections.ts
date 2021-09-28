import { BBox, Feature, GeoJsonProperties, MultiPolygon, Polygon } from "geojson";
import bboxToPolygon from "@turf/bbox-polygon";
import union from "@turf/union";
import { IStacCollection } from "types/stac";

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
  // are renderable
  if (collection.item_assets) {
    return !!Object.values(collection.item_assets).find(a =>
      a.type?.toLowerCase().includes("geotiff")
    );
  }
  return false;
};
