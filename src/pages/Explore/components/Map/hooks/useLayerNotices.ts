import * as atlas from "azure-maps-control";
import { useCallback } from "react";
import intersects from "@turf/boolean-intersects";
import bboxToPolygon from "@turf/bbox-polygon";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setCamera, setZoom } from "pages/Explore/state/mapSlice";
import { BBox } from "geojson";
import { stacCollectionDatasource } from "pages/Explore/utils/layers";
import { selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";
import { ILayerState, ILayerZoomVisibility } from "pages/Explore/types";

/*
 *  Handle zoom toast for layers with min zoom level
 */
const useMapZoomToLayer = () => {
  const dispatch = useExploreDispatch();
  const {
    map: { zoom },
    detail: {
      display: { showSelectedItemAsLayer },
    },
  } = useExploreSelector(s => s);
  const currentMosaic = useExploreSelector(selectCurrentMosaic);
  const { currentEditingLayerId, layers: allMosaics } = useExploreSelector(
    s => s.mosaic
  );
  const searchIdLoaded = Boolean(currentMosaic.query.searchId);

  const visibleInZoom = useCallback(
    (layer: ILayerState) => {
      return zoom + 0.5 >= layer.layer.minZoom;
    },
    [zoom]
  );

  // Check zoom visibility for the currently edited layer
  const currentLayerNotVisible =
    !visibleInZoom(currentMosaic) && searchIdLoaded && !showSelectedItemAsLayer;

  const zoomToLayer = useCallback(() => {
    dispatch(setZoom(currentMosaic.layer.minZoom));
  }, [dispatch, currentMosaic.layer.minZoom]);

  // Check zoom visibility for all pinned layers
  const layersOutOfZoom = Object.entries(allMosaics).filter(
    ([id, layer]) => id !== currentEditingLayerId && !visibleInZoom(layer)
  );
  const nonVisibleLayers: ILayerState[] = layersOutOfZoom.map(([, layer]) => layer);
  const layers: ILayerZoomVisibility = {
    current: currentLayerNotVisible ? currentMosaic : null,
    others: nonVisibleLayers,
  };

  const showZoomMsg = currentLayerNotVisible || nonVisibleLayers.length > 0;
  return { showZoomMsg, zoomToLayer, nonVisibleLayers: layers };
};

const useMapZoomToExtent = (mapRef: React.MutableRefObject<atlas.Map | null>) => {
  const dispatch = useExploreDispatch();
  const mosaic = useExploreSelector(selectCurrentMosaic);

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

export { useMapZoomToLayer, useMapZoomToExtent };
