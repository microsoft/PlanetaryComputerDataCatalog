import * as atlas from "azure-maps-control";
import { useCallback } from "react";
import intersects from "@turf/boolean-intersects";
import bboxToPolygon from "@turf/bbox-polygon";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setZoom } from "pages/Explore/state/mapSlice";
import { BBox } from "geojson";

// Handle zoom toast for layers with min zoom level
const useZoomToLayer = () => {
  const dispatch = useExploreDispatch();
  const {
    mosaic,
    map: { zoom },
  } = useExploreSelector(s => s);
  const showZoomMsg = zoom + 0.5 <= mosaic.layer.minZoom && !!mosaic.query.hash;

  const zoomToLayer = useCallback(() => {
    dispatch(setZoom(mosaic.layer.minZoom));
  }, [dispatch, mosaic.layer.minZoom]);

  return { showZoomMsg, zoomToLayer };
};

const useMapZoomToExtent = (mapRef: React.MutableRefObject<atlas.Map | null>) => {
  const { mosaic } = useExploreSelector(s => s);

  const viewport = mapRef.current
    ? bboxToPolygon(mapRef.current?.getCamera().bounds as BBox)?.geometry
    : null;
  const collectionGeoms = mosaic.collection?.extent.spatial.bbox.map(box =>
    bboxToPolygon(box as BBox)
  );

  // TODO: when mosaics are back
  const showExtentMsg =
    // !!mosaic.query.hash &&
    !!collectionGeoms?.length &&
    !!viewport &&
    !collectionGeoms.some(geom => intersects(geom, viewport));

  const zoomToExtent = () => {};

  return { showExtentMsg, zoomToExtent };
};

export { useZoomToLayer as useMapZoomToLayer, useMapZoomToExtent };
