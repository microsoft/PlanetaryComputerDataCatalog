import * as atlas from "azure-maps-control";
import { useEffect } from "react";
import { makeTileJsonUrl } from "utils";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { itemOutlineLayerName } from "pages/Explore/utils/layers";

const useMosaicLayer = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  mapReady: boolean
) => {
  const { detail } = useExploreSelector(s => s);
  // const currentLayer = useExploreSelector(selectCurrentMosaic);
  // const { collection, query, renderOption } = currentLayer;
  const mosaics = useExploreSelector(s => s.mosaic.layers);

  // If we are showing the detail as a tile layer, craft the tileJSON request
  // with the selected item (TODO: make custom redux selector, it's used elsewhere)
  const stacItemForMosaic = detail.showAsLayer ? detail.selectedItem : null;
  const isItemLayerValid = stacItemForMosaic;

  // Add a mosaic layer endpoint to the map
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const map = mapRef.current;
    Object.entries(mosaics).forEach(([id, mosaic]) => {
      const { query, renderOption, collection } = mosaic;
      const mosaicLayer = map.layers.getLayerById(id);
      const isMosaicLayerValid = query.searchId;

      if ((isMosaicLayerValid || isItemLayerValid) && renderOption) {
        const tileLayerOpts: atlas.TileLayerOptions = {
          tileUrl: makeTileJsonUrl(
            query,
            renderOption,
            collection,
            stacItemForMosaic
          ),
          visible: true,
        };

        if (mosaicLayer) {
          (mosaicLayer as atlas.layer.TileLayer).setOptions(tileLayerOpts);
        } else {
          const layer = new atlas.layer.TileLayer(
            tileLayerOpts,
            query.searchId || ""
          );
          map.layers.add(layer, itemOutlineLayerName);
        }
      } else {
        if (mosaicLayer) {
          // Remove visibility of the mosaic layer, rather than remove it from the map. As a result,
          // the opacity settings will be retained
          (mosaicLayer as atlas.layer.TileLayer).setOptions({ visible: false });
        }
      }
    });
  }, [mapRef, mapReady, stacItemForMosaic, isItemLayerValid, mosaics]);
};

export default useMosaicLayer;
