import { useEffect, useState, useRef } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";

import { stacSearchDatasource, layerControl } from "./viewerLayers";
import { useExploreSelector } from "./state/hooks";

const mapContainerId: string = "viewer-map";

const ExploreMap = () => {
  const mapRef = useRef<atlas.Map | null>(null);
  // const mosaicLayerRef = useRef<atlas.layer.TileLayer | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const {
    map: { center, zoom },
    mosaic,
  } = useExploreSelector(s => s);

  // Add a mosaic layer endpoint to the map
  useEffect(() => {
    const mosaicLayer = mapRef.current?.layers.getLayerById("stac-mosaic");
    // TEMP: this is all fake. Just use the existing tilejson mosaic rather than the cql query based one.
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
      center: center,
      zoom: zoom,
    });
  }, [center, zoom]);

  useEffect(() => {
    const map = mapRef.current;

    if (mapReady && map && map.sources.getSources().length === 0) {
      map.sources.add(stacSearchDatasource);
      map.controls.add(layerControl, {
        position: atlas.ControlPosition.BottomRight,
      });
    }
  }, [mapReady]);

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
      mapRef.current = map;
    }

    const map = mapRef.current;

    // Remove event handlers on unmount
    return () => map.events.remove("ready", onReady);
  }, [center, zoom]);

  // const handleMapClick = useCallback((e: atlas.MapMouseEvent) => {
  //   if (e?.shapes?.length) {
  //     const shapes = e.shapes as atlas.Shape[];
  //     const ids = shapes.map(s => s.getId().toString());
  //     setSelectedItemIds(ids);
  //   }
  // }, []);

  return <div id={mapContainerId} style={{ width: "100%", height: "100%" }}></div>;
};

export default ExploreMap;
