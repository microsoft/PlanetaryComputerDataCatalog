import * as atlas from "azure-maps-control";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { useEffect } from "react";
import { itemLineLayer, stacItemDatasource } from "../layers";

// Show highlighted stac item result footprint on the map

const useItemBoundsLayer = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  mapReady: boolean
) => {
  const {
    map: { boundaryShape },
    detail,
  } = useExploreSelector(s => s);

  const boundaryPoly = boundaryShape ?? detail.selectedItem?.geometry;

  useEffect(() => {
    const map = mapRef.current;

    if (!mapReady || !map) return;

    if (!map.sources.getSources().includes(stacItemDatasource)) {
      map.sources.add(stacItemDatasource);
      map.layers.add(itemLineLayer, "labels");
    }
  }, [mapRef, mapReady]);

  useEffect(() => {
    if (!boundaryPoly) {
      stacItemDatasource.clear();
    } else {
      const geom = boundaryPoly as atlas.data.MultiPolygon;
      stacItemDatasource.clear();
      stacItemDatasource.add(geom);

      if (detail.showAsLayer) {
        mapRef.current?.setCamera({
          bounds: atlas.data.BoundingBox.fromData(geom),
          padding: 100,
          duration: 500,
          type: "ease",
        });
      }
    }
  }, [mapRef, boundaryPoly, detail.showAsLayer]);
};

export default useItemBoundsLayer;
