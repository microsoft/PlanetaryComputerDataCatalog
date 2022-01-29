import * as atlas from "azure-maps-control";

import { useExploreSelector } from "pages/Explore/state/hooks";
import { useEffect } from "react";
import {
  collectionLineLayer,
  collectionOutlineLayer,
  stacCollectionDatasource,
} from "../../../utils/layers";
import { MAX_ZOOM_FOR_COLLECTION_OUTLINE } from "pages/Explore/utils/constants";
import { spatialExtentToMultipolygon } from "utils/collections";
import { selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";

// Show highlighted stac item result footprint on the map

const useCollectionBoundsLayer = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  mapReady: boolean
) => {
  const { collection } = useExploreSelector(selectCurrentMosaic);
  const { showCollectionOutline, zoom } = useExploreSelector(s => s.map);

  useEffect(() => {
    const map = mapRef.current;

    if (!mapReady || !map) return;

    if (!map.sources.getSources().includes(stacCollectionDatasource)) {
      map.sources.add(stacCollectionDatasource);
      map.layers.add(collectionLineLayer, "labels");
      map.layers.add(collectionOutlineLayer, collectionLineLayer);
    }
  }, [mapRef, mapReady]);

  useEffect(() => {
    const bbox = collection?.extent.spatial.bbox;

    if (!bbox) {
      stacCollectionDatasource.clear();
    } else {
      stacCollectionDatasource.clear();
      const multiPoly = spatialExtentToMultipolygon(bbox);

      if (multiPoly) {
        stacCollectionDatasource.add(multiPoly);
      }

      // Sync the line layers with the visibility setting, or if the zoom level is low
      const isCollectionBoundsVisible =
        showCollectionOutline && zoom <= MAX_ZOOM_FOR_COLLECTION_OUTLINE;
      collectionLineLayer.setOptions({ visible: isCollectionBoundsVisible });
      collectionOutlineLayer.setOptions({ visible: isCollectionBoundsVisible });
    }
  }, [mapRef, collection, showCollectionOutline, zoom]);
};

export default useCollectionBoundsLayer;
