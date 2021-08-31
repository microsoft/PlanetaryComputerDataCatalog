import atlas from "azure-maps-control";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setCamera } from "pages/Explore/state/mapSlice";
import { useCallback } from "react";

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
      const layers = e.map.layers;
      if (layers.getLayers()[0].getId() !== "base") {
        layers.move("stac-item-outline", "labels");
        layers.move("stac-mosaic", "stac-item-outline");
      }
    }
  }, []);

  return { onMapMove, onStyleDataLoaded };
};

export default useMapEvents;
