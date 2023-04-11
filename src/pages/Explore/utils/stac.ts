import atlas from "azure-maps-control";
import bboxToPolygon from "@turf/bbox-polygon";
import { BBox } from "geojson";

import { IStacCollection, IStacFilterCollection, IStacFilterGeom } from "types/stac";
import { CqlDateRange } from "./cql/types";
import { formatDatetime, getDayEnd } from "./time";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { titleCase } from "utils";

export const collectionFilter = (
  collectionId: string | undefined
): IStacFilterCollection | null => {
  if (!collectionId) return null;

  return {
    op: "=",
    args: [{ property: "collection" }, collectionId],
  };
};

export const geomFilter = (
  bbox: atlas.data.BoundingBox | null
): IStacFilterGeom | null => {
  if (!bbox) return null;

  return {
    op: "s_intersects",
    args: [
      {
        property: "geometry",
      },
      bboxToPolygon(bbox as BBox).geometry,
    ],
  };
};

export const rangeFromTemporalExtent = (
  interval: IStacCollection["extent"]["temporal"]["interval"]
): CqlDateRange => {
  const today = formatDatetime(new Date());

  const start = interval[0][0] || today;
  const end = interval[0][1] || formatDatetime(getDayEnd(new Date()));

  return [start, end];
};

export const getQueryableTitle = (field: JSONSchema | undefined, key: string) => {
  // Get the value after a possible colon
  const unprefixed = key.split(":").pop() || key;
  return (field && field.title) || titleCase(unprefixed, "_");
};
