import { useCallback } from "react";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setZoom } from "pages/Explore/state/mapSlice";

// Handle zoom toast for layers with min zoom level
const useMapZoomToLayer = () => {
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

export default useMapZoomToLayer;
