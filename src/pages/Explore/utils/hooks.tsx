import * as atlas from "azure-maps-control";
import { GeoJsonObject } from "geojson";
import { useEffect } from "react";
import { makeCollectionTileJsonUrl } from "utils";
import { MosaicState } from "../state/mosaicSlice";
import { stacItemDatasource } from "../components/controls/viewerLayers";

// Show highlighted stac item result footprint on the map
export const useShowBoundary = (
  boundaryShape: GeoJsonObject | null | undefined = null
) => {
  useEffect(() => {
    if (boundaryShape === null) {
      stacItemDatasource.clear();
    } else {
      stacItemDatasource.clear();
      stacItemDatasource.add(boundaryShape as atlas.data.Geometry);
    }
  }, [boundaryShape]);
};

export const useMosaicLayer = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  selectedMosaic: MosaicState
) => {
  const { collection, query, renderOption } = selectedMosaic;
  // Add a mosaic layer endpoint to the map
  useEffect(() => {
    const mosaicLayer = mapRef.current?.layers.getLayerById("stac-mosaic");

    if (collection && query.hash && renderOption) {
      // TODO: checking for tilejson asset is a temporary measure until mosaics are dynamic.
      const tilejsonAsset = Object.values(collection.assets).find(asset =>
        asset.roles?.includes("tiles")
      );

      if (tilejsonAsset) {
        const tileLayer = {
          tileUrl: makeCollectionTileJsonUrl(collection, query, renderOption),
        };
        const layer = new atlas.layer.TileLayer(tileLayer, "stac-mosaic");

        if (mosaicLayer) {
          mapRef.current?.layers.remove(mosaicLayer);
        }
        mapRef.current?.layers.add(layer, "stac-item-outline");
        console.log("mosaic layer added");
      }
    } else {
      if (mosaicLayer) {
        mapRef.current?.layers.remove(mosaicLayer);
      }
    }
  }, [collection, query, renderOption, mapRef]);
};
