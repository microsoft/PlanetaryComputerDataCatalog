import * as atlas from "azure-maps-control";
import { useEffect } from "react";
import { makeTileJsonUrl } from "utils";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { itemOutlineLayerName } from "pages/Explore/utils/layers";

export const mosaicLayerName = "stac-mosaic";

const useMosaicLayer = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  mapReady: boolean
) => {
  const { mosaic, detail } = useExploreSelector(s => s);
  const { collection, query, renderOption } = mosaic;

  // If we are showing the detail as a tile layer, craft the tileJSON request
  // with the selected item
  const stacItemForMosaic = detail.showAsLayer ? detail.selectedItem : null;

  // Add a mosaic layer endpoint to the map
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const map = mapRef.current;
    const mosaicLayer = map.layers.getLayerById("stac-mosaic");
    const removeMosaic = () => mosaicLayer && map.layers.remove(mosaicLayer);
    const isItemLayerValid = stacItemForMosaic && collection;
    const isMosaicLayerValid = query.hash;

    if ((isMosaicLayerValid || isItemLayerValid) && renderOption) {
      const tileLayerOpts = {
        tileUrl: makeTileJsonUrl(query, renderOption, collection, stacItemForMosaic),
      };

      if (mosaicLayer) {
        (mosaicLayer as atlas.layer.TileLayer).setOptions(tileLayerOpts);
      } else {
        const layer = new atlas.layer.TileLayer(tileLayerOpts, mosaicLayerName);
        map.layers.add(layer, itemOutlineLayerName);
      }
    } else {
      removeMosaic();
    }
  }, [collection, query, renderOption, mapRef, stacItemForMosaic, mapReady]);
};

export default useMosaicLayer;
