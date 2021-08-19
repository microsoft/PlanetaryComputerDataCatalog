import { useEffect, useState, useRef, useCallback } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";

import { stacSearchDatasource, layerControl } from "./viewerLayers";
import { useExploreDispatch, useExploreSelector } from "./state/hooks";
import { setCamera, setZoom } from "./state/mapSlice";
import { Link, useTheme } from "@fluentui/react";
import { useTileJson } from "utils/requests";
import { DATA_URL } from "utils/constants";
import { setLayerMinZoom } from "./state/mosaicSlice";

const mapContainerId: string = "viewer-map";

const ExploreMap = () => {
  const dispatch = useExploreDispatch();
  const {
    map: { center, zoom },
    mosaic,
  } = useExploreSelector(s => s);

  const theme = useTheme();
  const mapRef = useRef<atlas.Map | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const { data } = useTileJson(mosaic.collection?.id, mosaic.query.hash);

  useEffect(() => {
    console.log(data);
    if (data?.minzoom) {
      dispatch(setLayerMinZoom(data.minzoom));
    }
  }, [dispatch, data]);

  // Add a mosaic layer endpoint to the map
  useEffect(() => {
    const mosaicLayer = mapRef.current?.layers.getLayerById("stac-mosaic");

    if (mosaic.collection && mosaic.query.hash && mosaic.renderOption) {
      const tilejsonAsset = Object.values(mosaic.collection.assets).find(asset =>
        asset.roles?.includes("tiles")
      );

      if (tilejsonAsset) {
        const tileLayer = {
          tileUrl: `${DATA_URL}/collection/tilejson.json?hash=${mosaic.query.hash}&collection=${mosaic.collection.id}&${mosaic.renderOption.options}`,
        };
        const layer = new atlas.layer.TileLayer(tileLayer, "stac-mosaic");

        if (mosaicLayer) {
          mapRef.current?.layers.remove(mosaicLayer);
        }
        mapRef.current?.layers.add(layer, "labels");
      }
    } else {
      if (mosaicLayer) {
        mapRef.current?.layers.remove(mosaicLayer);
      }
    }
  }, [mosaic]);

  useEffect(() => {
    if (zoom !== mapRef.current?.getCamera().zoom)
      mapRef.current?.setCamera({
        zoom: zoom,
        type: "ease",
        duration: 750,
      });
  }, [zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;

    if (map.sources.getSources().length === 0) {
      map.sources.add(stacSearchDatasource);
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

  const handleCameraChange = useCallback(
    (e: atlas.MapEvent) => {
      const camera = e.map.getCamera();
      dispatch(setCamera(camera));
    },
    [dispatch]
  );

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
      map.events.add("moveend", handleCameraChange);
      mapRef.current = map;
    }

    const map = mapRef.current;

    // Remove event handlers on unmount
    return () => map.events.remove("ready", onReady);
  }, [center, zoom, handleCameraChange]);

  const zoomToLayer = () => {
    dispatch(setZoom(mosaic.layer.minZoom));
  };

  const showZoomMsg = zoom + 0.5 <= mosaic.layer.minZoom && !!mosaic.query.hash;

  const zoomMsg = (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: "50%",
        transform: "translate(-50%, 0)",
        zIndex: 1,
        padding: "5px 10px",
        borderRadius: 15,
        border: "1px solid",
        borderColor: theme.semanticColors.buttonBorder,
        backgroundColor: theme.semanticColors.defaultStateBackground,
      }}
    >
      <Link onClick={zoomToLayer}>Zoom in</Link> to see layer
    </div>
  );

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {showZoomMsg && zoomMsg}
      <div id={mapContainerId} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default ExploreMap;
