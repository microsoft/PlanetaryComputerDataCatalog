import { useEffect, useState, useRef, useCallback } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";

import { stacSearchDatasource, layerControl } from "./viewerLayers";
import { useExploreDispatch, useExploreSelector } from "./state/hooks";
import { setCamera } from "./state/mapSlice";

const mapContainerId: string = "viewer-map";

const ExploreMap = () => {
  const dispatch = useExploreDispatch();
  const {
    map: { center, zoom },
    mosaic,
  } = useExploreSelector(s => s);

  const mapRef = useRef<atlas.Map | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);

  // Add a mosaic layer endpoint to the map
  useEffect(() => {
    const mosaicLayer = mapRef.current?.layers.getLayerById("stac-mosaic");
    // TODO: this is all fake. Just use the existing tilejson mosaic rather than the cql query based one.
    if (
      mosaic.collection &&
      mosaic.query.name &&
      mosaic.query.hash &&
      mosaic.renderOptions
    ) {
      const tilejsonAsset = Object.values(mosaic.collection.assets).find(asset =>
        asset.roles?.includes("tiles")
      );

      if (tilejsonAsset) {
        console.log("mapping " + mosaic.query.name);
        const layer = new atlas.layer.TileLayer(
          {
            tileUrl: tilejsonAsset.href,
          },
          "stac-mosaic"
        );

        if (!mosaicLayer) {
          mapRef.current?.layers.add(layer, "labels");
        }
      }
    } else {
      if (mosaicLayer) {
        mapRef.current?.layers.remove(mosaicLayer);
      }
    }
  }, [mosaic]);

  useEffect(() => {
    mapRef.current?.setCamera({
      zoom: zoom,
    });
  }, [zoom]);

  useEffect(() => {
    const map = mapRef.current;

    if (mapReady && map && map.sources.getSources().length === 0) {
      map.sources.add(stacSearchDatasource);
      map.controls.add(layerControl, {
        position: atlas.ControlPosition.BottomRight,
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

  return <div id={mapContainerId} style={{ width: "100%", height: "100%" }}></div>;
};

export default ExploreMap;
