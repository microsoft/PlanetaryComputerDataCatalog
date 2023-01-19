import * as atlas from "azure-maps-control";
import { useEffect } from "react";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { LayerType } from "pages/Explore/enums";
import {
  makeDatasourceId,
  makeLayerHeatmapId,
  makeLayerId,
  makeLayerOutlineId,
  mosaicLayerPrefix,
  setupPolygonLayers,
  setupRasterTileLayer,
} from "../helpers";

const useMosaicLayer = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  mapReady: boolean
) => {
  const { detail } = useExploreSelector(s => s);
  const { layers, layerOrder, currentEditingLayerId } = useExploreSelector(
    s => s.mosaic
  );

  // If we are showing the detail as a tile layer, craft the tileJSON request
  // with the selected item (TODO: make custom redux selector, it's used elsewhere)
  const stacItemForMosaic = detail.display.showSelectedItemAsLayer
    ? detail.selectedItem
    : null;
  const isItemLayerValid = Boolean(stacItemForMosaic);

  // Shuffle the map layer order when the layerOrder changes
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const map = mapRef.current;

    layerOrder
      .map((id, idx, arr) => [
        makeLayerId(id),
        idx < arr.length - 1 ? makeLayerId(arr[idx + 1]) : null,
      ])
      .forEach(([higherLayerId, lowerLayerId]) => {
        if (
          higherLayerId &&
          lowerLayerId &&
          map.layers.getLayerById(higherLayerId) &&
          map.layers.getLayerById(lowerLayerId)
        ) {
          map.layers.move(lowerLayerId, higherLayerId);
        }
      });
  }, [layerOrder, mapReady, mapRef]);

  // Add a mosaic layer endpoint to the map
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const map = mapRef.current;
    layerOrder
      .slice()
      .reverse()
      .forEach(id => {
        const mosaic = layers[id];
        const mapLayerId = makeLayerId(id);
        const { renderOption } = mosaic;
        const mapLayer = map.layers.getLayerById(mapLayerId);

        if (!renderOption) return;

        if (renderOption.type === LayerType.tile) {
          setupRasterTileLayer(
            map,
            mapLayerId,
            mapLayer,
            isItemLayerValid,
            id,
            currentEditingLayerId,
            stacItemForMosaic,
            mosaic
          );
        } else if (renderOption.type === LayerType.polygon) {
          setupPolygonLayers(map, mapLayer, mapLayerId, mosaic);
        }
      });

    // Remove any mosaic layers from the map that may have been unpinned
    map.layers
      .getLayers()
      .filter(l => l.getId().startsWith(mosaicLayerPrefix))
      .forEach(layer => {
        const layerId = layer.getId();
        const id = layerId.substring(mosaicLayerPrefix.length);

        if (
          id in layers === false &&
          !layerId.endsWith("-outline") &&
          !layerId.endsWith("-heatmap")
        ) {
          // Remove the main layer
          map.layers.remove(layer);

          // Remove its outline layer if it exists
          const outline = map.layers.getLayerById(makeLayerOutlineId(layerId));
          outline && map.layers.remove(outline);

          // Remove its heatmap layer if it exists
          const heatmap = map.layers.getLayerById(makeLayerHeatmapId(layerId));
          heatmap && map.layers.remove(heatmap);

          // Remove the associated datasource if it exists
          const dsId = makeDatasourceId(layerId);
          const datasource = map.sources.getById(dsId);
          if (datasource) {
            map.sources.remove(datasource);
          }
        }
      });
  }, [
    mapRef,
    mapReady,
    stacItemForMosaic,
    isItemLayerValid,
    layerOrder,
    layers,
    currentEditingLayerId,
  ]);
};

export default useMosaicLayer;
