import { useEffect, useState, useRef, useCallback } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";

import {
  stacItemDatasource,
  layerControl,
  itemLineLayer,
} from "./controls/viewerLayers";
import { useExploreDispatch, useExploreSelector } from "../state/hooks";
import { setCamera, setZoom } from "../state/mapSlice";
import { useTileJson } from "utils/requests";
import { setLayerMinZoom } from "../state/mosaicSlice";
import { useMosaicLayer, useShowBoundary } from "../utils/hooks";
import ZoomMessage from "./controls/ZoomMessage";

const mapContainerId: string = "viewer-map";

const ExploreMap = () => {
  const dispatch = useExploreDispatch();
  const {
    map: { center, zoom, boundaryShape, showSidebar },
    mosaic,
    detail,
  } = useExploreSelector(s => s);

  const mapRef = useRef<atlas.Map | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);

  // If there is a selected Item and we're meant to show it as a mosaic,
  // select that item for use in mosaic tile requests.
  const itemForMosaic = detail.showAsLayer ? detail.selectedItem : null;

  const { data: mosaicLayerTileJson } = useTileJson(
    mosaic.collection,
    mosaic.query,
    mosaic.renderOption,
    itemForMosaic
  );
  const layerMinZoom = mosaicLayerTileJson?.minzoom;

  useShowBoundary(
    mapRef,
    boundaryShape ?? detail.selectedItem?.geometry,
    detail.showAsLayer
  );
  useMosaicLayer(mapRef, mosaic, itemForMosaic);

  // Set the minzoom for the current layer
  useEffect(() => {
    if (layerMinZoom) {
      dispatch(setLayerMinZoom(layerMinZoom));
    }
  }, [dispatch, layerMinZoom]);

  // Zoom the map to the new level
  useEffect(() => {
    if (zoom !== mapRef.current?.getCamera().zoom)
      mapRef.current?.setCamera({
        zoom: zoom,
        center: center,
        type: "ease",
        duration: 750,
      });
  }, [zoom, center]);

  useEffect(() => {
    setTimeout(() => {
      mapRef.current?.resize();
    }, 350);
  }, [showSidebar]);

  // Setup tile layers and map controls
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;

    if (!map.sources.getSources().includes(stacItemDatasource)) {
      map.sources.add(stacItemDatasource);
      map.layers.add(itemLineLayer, "labels");
    }

    if (!map.controls.getControls().includes(layerControl)) {
      map.controls.add(new atlas.control.ZoomControl(), {
        position: atlas.ControlPosition.TopRight,
      });
      map.controls.add(layerControl, {
        position: atlas.ControlPosition.TopRight,
      });
    }
  }, [mapReady]);

  // Update state when map moves end
  const handleMapMove = useCallback(
    (e: atlas.MapEvent) => {
      const camera = e.map.getCamera();
      dispatch(setCamera(camera));
    },
    [dispatch]
  );

  // Initialize the map
  useEffect(() => {
    const onReady = () => setMapReady(true);

    if (!mapRef.current) {
      const map = new atlas.Map(mapContainerId, {
        view: "Auto",
        center: center,
        zoom: zoom,
        language: "en-US",
        showFeedbackLink: false,
        showLogo: false,
        style: "road_shaded_relief",
        renderWorldCopies: true,
        authOptions: {
          authType: atlas.AuthenticationType.subscriptionKey,
          subscriptionKey: process.env.REACT_APP_AZMAPS_KEY,
        },
      });

      map.events.add("ready", onReady);
      map.events.add("moveend", handleMapMove);
      mapRef.current = map;
    }

    const map = mapRef.current;

    // Remove event handlers on unmount
    return () => map.events.remove("ready", onReady);
  }, [center, zoom, handleMapMove]);

  // Handle zoom toast for layers with min zoom level
  const zoomToLayer = useCallback(() => {
    dispatch(setZoom(mosaic.layer.minZoom));
  }, [dispatch, mosaic.layer.minZoom]);
  const showZoomMsg = zoom + 0.5 <= mosaic.layer.minZoom && !!mosaic.query.hash;
  const zoomMsg = <ZoomMessage onClick={zoomToLayer} />;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {showZoomMsg && zoomMsg}
      <div id={mapContainerId} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default ExploreMap;
