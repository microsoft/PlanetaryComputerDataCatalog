import * as atlas from "azure-maps-control";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setLayerMinZoom } from "pages/Explore/state/mosaicSlice";
import { DEFAULT_MIN_ZOOM } from "pages/Explore/utils/constants";
import { useEffect } from "react";
import { useTileJson } from "utils/requests";

const ZOOM_DURATION = 750;
const SIDEBAR_DURATION = 350;

const useZoomEvents = (mapRef: React.MutableRefObject<atlas.Map | null>) => {
  const dispatch = useExploreDispatch();
  const {
    map: { center, zoom, bounds, showSidebar },
    mosaic,
    detail,
  } = useExploreSelector(s => s);

  // If we are showing the detail as a tile layer, craft the tileJSON request
  // with the selected item
  const stacItemForMosaic = detail.showAsLayer ? detail.selectedItem : null;

  const { data: mosaicLayerTileJson } = useTileJson(
    mosaic.query,
    mosaic.renderOption,
    mosaic.collection,
    stacItemForMosaic
  );

  const map = mapRef.current;
  const layerMinZoom =
    mosaic.renderOption?.minZoom || mosaicLayerTileJson?.minzoom || DEFAULT_MIN_ZOOM;

  // Set the minzoom for the current mosaic layer
  useEffect(() => {
    if (layerMinZoom) {
      dispatch(setLayerMinZoom(layerMinZoom));
    }
  }, [dispatch, layerMinZoom]);

  // Zoom the map to the new level
  useEffect(() => {
    if (!map) return;

    if (zoom !== map.getCamera().zoom) {
      map.setCamera({
        zoom: zoom,
        center: center,
        type: "ease",
        duration: ZOOM_DURATION,
      });
    }
  }, [zoom, center, map]);

  // Fit the map to the provided bounds
  useEffect(() => {
    if (!map) return;
    if (bounds[0] !== map.getCamera().bounds?.[0]) {
      map.setCamera({
        bounds,
        padding: 20,
        type: "jump",
      });
    }
  }, [bounds, map]);

  // Resize the map after the sidebar has been hidden or restored
  useEffect(() => {
    if (!map) return;

    setTimeout(() => {
      map.resize();
    }, SIDEBAR_DURATION);
  }, [map, showSidebar]);
};

export default useZoomEvents;
