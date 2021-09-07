import atlas from "azure-maps-control";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setCamera } from "pages/Explore/state/mapSlice";
import { useCallback } from "react";
import { mosaicLayerName, outlineLayerName } from "./useMosaicLayer";

const useMapEvents = () => {
  const dispatch = useExploreDispatch();

  // Update state when map moves end
  const onMapMove = useCallback(
    (e: atlas.MapEvent) => {
      const camera = e.map.getCamera();
      dispatch(setCamera(camera));
    },
    [dispatch]
  );

  const onStyleDataLoaded = useCallback((e: atlas.MapDataEvent) => {
    if (e.dataType === "style") {
      const layerMgr = e.map.layers;
      if (layerMgr.getLayers()[0].getId() !== "base") {
        const hasOutlineLayer = layerMgr.getLayerById(outlineLayerName);
        if (hasOutlineLayer) {
          layerMgr.move(outlineLayerName, "labels");
        }

        const hasMosaicLayer = layerMgr.getLayerById(mosaicLayerName);
        if (hasOutlineLayer && hasMosaicLayer) {
          layerMgr.move(mosaicLayerName, outlineLayerName);
        }
      }
    }
  }, []);

  return { onMapMove, onStyleDataLoaded };
};

export default useMapEvents;
