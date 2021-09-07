import * as atlas from "azure-maps-control";
import bboxToPolygon from "@turf/bbox-polygon";
import { featureCollection } from "@turf/helpers";

import { useExploreSelector } from "pages/Explore/state/hooks";
import { useEffect } from "react";
import {
  collectionLineLayer,
  collectionOutlineLayer,
  stacCollectionDatasource,
} from "../../utils/layers";
import { BBox } from "geojson";

// Show highlighted stac item result footprint on the map

const useCollectionBoundsLayer = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  mapReady: boolean
) => {
  const collection = useExploreSelector(s => s.mosaic.collection);

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
      const polys = bbox.map(box => bboxToPolygon(box as BBox));
      const fc = featureCollection(polys);

      stacCollectionDatasource.clear();
      stacCollectionDatasource.add(fc);
    }
  }, [mapRef, collection]);
};

export default useCollectionBoundsLayer;
