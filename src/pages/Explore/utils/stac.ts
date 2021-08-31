import atlas from "azure-maps-control";
import bboxToPolygon from "@turf/bbox-polygon";
import { BBox } from "geojson";

import { IStacFilterCollection, IStacFilterGeom } from "types/stac";

export const collectionFilter = (
  collectionId: string | undefined
): IStacFilterCollection | null => {
  if (collectionId) {
    return {
      eq: [{ property: "collection" }, collectionId],
    };
  }

  return null;
};

export const geomFilter = (bbox: atlas.data.BoundingBox): IStacFilterGeom => {
  return {
    intersects: [
      {
        property: "geometry",
      },
      bboxToPolygon(bbox as BBox).geometry,
    ],
  };
};
