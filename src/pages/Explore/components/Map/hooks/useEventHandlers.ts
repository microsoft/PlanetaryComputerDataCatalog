import { useCallback, useEffect } from "react";
import { useWindowSize } from "react-use";
import atlas from "azure-maps-control";

import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setCamera } from "pages/Explore/state/mapSlice";
import { mosaicLayerName } from "./useMosaicLayer";
import {
  collectionLineLayer,
  collectionLineLayerName,
  collectionOutlineLayer,
  itemLineLayerName,
  itemOutlineLayerName,
} from "pages/Explore/utils/layers";

const useMapEvents = (mapRef: React.MutableRefObject<atlas.Map | null>) => {
  const dispatch = useExploreDispatch();
  const { height, width } = useWindowSize();

  useEffect(() => {
    mapRef.current?.resize();
  }, [height, width, mapRef]);

  // Update state when map moves end
  const onMapMove = useCallback(
    (e: atlas.MapEvent) => {
      const camera = e.map.getCamera();
      dispatch(setCamera(camera));
    },
    [dispatch]
  );

  // When the basemap style is changed, it changes the order of all loaded layers
  // which need to be manually reset.
  const onStyleDataLoaded = useCallback((e: atlas.MapDataEvent) => {
    if (e.dataType === "style") {
      const layerMgr = e.map.layers;

      if (layerMgr.getLayers()[0].getId() !== "base") {
        const hasOutlineLayer = layerMgr.getLayerById(itemLineLayerName);
        if (hasOutlineLayer) {
          layerMgr.move(itemLineLayerName, "labels");
          layerMgr.move(itemOutlineLayerName, itemLineLayerName);
        }
        const hasCollectionLayer = layerMgr.getLayerById(collectionLineLayerName);
        if (hasCollectionLayer) {
          layerMgr.move(collectionLineLayer, "labels");
          layerMgr.move(collectionOutlineLayer, collectionLineLayer);
        }

        const hasMosaicLayer = layerMgr.getLayerById(mosaicLayerName);
        if (hasOutlineLayer && hasMosaicLayer) {
          layerMgr.move(mosaicLayerName, itemLineLayerName);
        }

        // To prevent runaway re-renders, move the base layer under the first
        // layer if it isn't already. This likely means a custom layer hasn't been
        // handled above.
        const firstLayerId = layerMgr.getLayers()[0].getId();
        if (firstLayerId !== "base") {
          layerMgr.move("base", firstLayerId);
        }
      }
    }
  }, []);

  return { onMapMove, onStyleDataLoaded };
};

export default useMapEvents;
