import { useEffect, useState, useRef } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";

import { layerControl } from "components/viewer/viewerLayers";
import { useRequest } from "utils/requests";
import { Slider } from "@fluentui/react";

interface TileJsonViewerProps {
  href: string;
}

const mapContainerId = "tilejson-viewer";

const TileJsonViewer = ({ href }: TileJsonViewerProps) => {
  const mapRef = useRef<atlas.Map | null>(null);
  const layerRef = useRef<atlas.layer.TileLayer | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [opacity, setOpacity] = useState<number>(100);

  const { data: tilejson } = useRequest(href);

  // When the Azure maps control is ready, add the tile layer
  useEffect(() => {
    const map = mapRef.current;

    if (mapReady && map && tilejson) {
      map.setCamera({
        center: tilejson.center.slice(0, 2),
        zoom: tilejson.center[2],
      });
      layerRef.current = new atlas.layer.TileLayer({
        tileUrl: href,
      });
      map.layers.add(layerRef.current, "labels");
      map.controls.add(layerControl, {
        position: atlas.ControlPosition.TopLeft,
      });
    }
  }, [mapReady, tilejson, href]);

  // Update opacity when slider changes
  useEffect(() => {
    layerRef.current?.setOptions({ opacity: opacity / 100 });
  }, [opacity]);

  // Initialize the map on mount, update mapReady when ready
  useEffect(() => {
    const onReady = () => setMapReady(true);

    if (!mapRef.current) {
      const map = new atlas.Map(mapContainerId, {
        view: "Auto",
        language: "en-US",
        showFeedbackLink: false,
        showLogo: true,
        style: "grayscale_dark",
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
  }, []);

  return (
    <div>
      <Slider
        min={0}
        max={100}
        step={1}
        value={opacity}
        onChange={value => setOpacity(value)}
        label="Layer opacity"
        valueFormat={(value: number) => `${value}%`}
        styles={{ root: { maxWidth: 250 } }}
      />
      <div id={mapContainerId} style={{ width: "100%", height: "70vh" }}></div>
    </div>
  );
};

export default TileJsonViewer;
