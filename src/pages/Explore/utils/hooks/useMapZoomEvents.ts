import * as atlas from "azure-maps-control";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setLayerMinZoom } from "pages/Explore/state/mosaicSlice";
import { useEffect } from "react";
import { useTileJson } from "utils/requests";

const ZOOM_DURATION = 750;
const SIDEBAR_DURATION = 350;

const useMapZoomEvents = (mapRef: React.MutableRefObject<atlas.Map | null>) => {
  const dispatch = useExploreDispatch();
  const {
    map: { center, zoom, showSidebar },
    mosaic,
    detail,
  } = useExploreSelector(s => s);

  // If we are showing the detail as a tile layer, craft the tileJSON request
  // with the selected item
  const stacItemForMosaic = detail.showAsLayer ? detail.selectedItem : null;

  const { data: mosaicLayerTileJson } = useTileJson(
    mosaic.collection,
    mosaic.query,
    mosaic.renderOption,
    stacItemForMosaic
  );

  const map = mapRef.current;
  const layerMinZoom = mosaicLayerTileJson?.minzoom;

  // Set the minzoom for the current mosaic layer
  useEffect(() => {
    if (layerMinZoom) {
      dispatch(setLayerMinZoom(layerMinZoom));
    }
  }, [dispatch, layerMinZoom]);

  // Zoom the map to the new level
  useEffect(() => {
    if (!map) return;

    if (zoom !== map.getCamera().zoom)
      map.setCamera({
        zoom: zoom,
        center: center,
        type: "ease",
        duration: ZOOM_DURATION,
      });
  }, [zoom, center, map]);

  // Resize the map after the sidebar has been hidden or restored
  useEffect(() => {
    if (!map) return;

    setTimeout(() => {
      map.resize();
    }, SIDEBAR_DURATION);
  }, [map, showSidebar]);
};

export default useMapZoomEvents;
