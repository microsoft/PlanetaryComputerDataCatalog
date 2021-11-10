import * as atlas from "azure-maps-control";
import { useCallback } from "react";
import intersects from "@turf/boolean-intersects";
import bboxToPolygon from "@turf/bbox-polygon";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setCamera, setZoom } from "pages/Explore/state/mapSlice";
import { BBox } from "geojson";
import { stacCollectionDatasource } from "pages/Explore/utils/layers";

// Handle zoom toast for layers with min zoom level
const useZoomToLayer = () => {
  const dispatch = useExploreDispatch();
  const {
    mosaic,
    map: { zoom },
    detail: { showAsLayer },
  } = useExploreSelector(s => s);
  // TODO: check buffer around zoom
  const showZoomMsg =
    zoom + 0.5 <= mosaic.layer.minZoom && !!mosaic.query.searchId && !showAsLayer;

  const zoomToLayer = useCallback(() => {
    dispatch(setZoom(mosaic.layer.minZoom));
  }, [dispatch, mosaic.layer.minZoom]);

  return { showZoomMsg, zoomToLayer };
};

const useMapZoomToExtent = (mapRef: React.MutableRefObject<atlas.Map | null>) => {
  const dispatch = useExploreDispatch();
  const { mosaic } = useExploreSelector(s => s);

  const viewport = mapRef.current
    ? bboxToPolygon(mapRef.current?.getCamera().bounds as BBox)?.geometry
    : null;
  const collectionGeoms = mosaic.collection?.extent.spatial.bbox.map(box =>
    bboxToPolygon(box as BBox)
  );

  const showExtentMsg =
    !!collectionGeoms?.length &&
    !!viewport &&
    !collectionGeoms.some(geom => intersects(geom, viewport));

  const zoomToExtent = () => {
    const fc = stacCollectionDatasource.toJson();
    const overallBbox = atlas.data.BoundingBox.fromData(fc);
    dispatch(setCamera({ bounds: overallBbox }));
  };

  return { showExtentMsg, zoomToExtent };
};

export { useZoomToLayer as useMapZoomToLayer, useMapZoomToExtent };
