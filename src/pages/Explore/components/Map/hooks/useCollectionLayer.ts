import * as atlas from "azure-maps-control";
import bboxToPolygon from "@turf/bbox-polygon";

import { useExploreSelector } from "pages/Explore/state/hooks";
import { useEffect } from "react";
import {
  collectionLineLayer,
  collectionOutlineLayer,
  stacCollectionDatasource,
} from "../../../utils/layers";
import { BBox, Feature, GeoJsonProperties, MultiPolygon, Polygon } from "geojson";
import union from "@turf/union";
import { MAX_ZOOM_FOR_COLLECTION_OUTLINE } from "pages/Explore/utils/constants";

// Show highlighted stac item result footprint on the map

const useCollectionBoundsLayer = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  mapReady: boolean
) => {
  const collection = useExploreSelector(s => s.mosaic.collection);
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
      const polys = bbox.map(box => bboxToPolygon(box as BBox));

      const multiPoly = polys.reduce<Feature<
        Polygon | MultiPolygon,
        GeoJsonProperties
      > | null>((unionedPoly, currPoly) => {
        if (unionedPoly) {
          return union(unionedPoly.geometry, currPoly.geometry);
        }
        // base case
        return currPoly;
      }, null);

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
