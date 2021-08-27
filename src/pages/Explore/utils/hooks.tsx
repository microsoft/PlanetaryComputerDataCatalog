import * as atlas from "azure-maps-control";
import { GeoJsonObject } from "geojson";
import { useEffect } from "react";
import { makeCollectionTileJsonUrl } from "utils";
import { MosaicState } from "../state/mosaicSlice";
import { stacItemDatasource } from "../components/controls/viewerLayers";
import { IStacItem } from "types/stac";

// Show highlighted stac item result footprint on the map
export const useShowBoundary = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  boundaryShape: GeoJsonObject | null | undefined = null,
  zoomTo: boolean = false
) => {
  useEffect(() => {
    if (boundaryShape === null) {
      stacItemDatasource.clear();
    } else {
      const geom = boundaryShape as atlas.data.MultiPolygon;
      stacItemDatasource.clear();
      stacItemDatasource.add(geom);

      if (zoomTo) {
        mapRef.current?.setCamera({
          bounds: atlas.data.BoundingBox.fromData(geom),
          padding: 100,
          duration: 500,
          type: "ease",
        });
      }
    }
  }, [mapRef, boundaryShape, zoomTo]);
};

export const useMosaicLayer = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  selectedMosaic: MosaicState,
  selectedItem: IStacItem | null = null
) => {
  const { collection, query, renderOption } = selectedMosaic;
  // Add a mosaic layer endpoint to the map
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const mosaicLayer = map.layers.getLayerById("stac-mosaic");
    const removeMosaic = () => mosaicLayer && map.layers.remove(mosaicLayer);

    if (collection && query.hash && renderOption) {
      // TODO: checking for tilejson asset is a temporary measure until mosaics are dynamic. We override this
      // for selectedItem, but that should not be necessary after dynamic mosaics.
      const tilejsonAsset = Object.values(collection.assets).find(asset =>
        asset.roles?.includes("tiles")
      );

      if (tilejsonAsset || selectedItem) {
        const tileLayer = {
          tileUrl: makeCollectionTileJsonUrl(
            collection,
            query,
            renderOption,
            selectedItem
          ),
        };
        const layer = new atlas.layer.TileLayer(tileLayer, "stac-mosaic");

        if (mosaicLayer) {
          map.layers.remove(mosaicLayer);
        }
        map.layers.add(layer, "stac-item-outline");
        console.log("mosaic layer added");
      } else {
        removeMosaic();
      }
    } else {
      removeMosaic();
    }
  }, [collection, query, renderOption, selectedItem, mapRef]);
};
