import { useEffect, useState, useRef } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";

import { layerControl } from "pages/Explore/utils/layers";
import { useCollectionMapInfo } from "utils/requests";
import { Slider, Stack, Toggle } from "@fluentui/react";

interface ITileJsonViewerProps {
  href: string;
  collectionId: string;
}

const mapContainerId = "tilejson-viewer";

const TileJsonViewer = ({ href, collectionId }: ITileJsonViewerProps) => {
  const mapRef = useRef<atlas.Map | null>(null);
  const layerRef = useRef<atlas.layer.TileLayer | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [opacity, setOpacity] = useState<number>(100);
  const [currentMapStyle, setCurrentMapStyle] = useState<string>("grayscale_dark");
  const [showLabels, setShowLabels] = useState<boolean>(true);

  const { data: mapData } = useCollectionMapInfo(collectionId);

  // When the Azure maps control is ready, add the tile layer
  useEffect(() => {
    const map = mapRef.current;

    if (mapReady && map && mapData) {
      map.setCamera({
        center: [...mapData.info.initialCoords].reverse(),
        zoom: mapData.info.initialZoom,
      });
      layerRef.current = new atlas.layer.TileLayer({
        tileUrl: href,
      });
      map.layers.add(layerRef.current, "labels");
      map.controls.add(layerControl, {
        position: atlas.ControlPosition.TopLeft,
      });
    }
  }, [mapReady, mapData, href]);

  // Update opacity when slider changes
  useEffect(() => {
    layerRef.current?.setOptions({ opacity: opacity / 100 });
  }, [opacity]);

  // Set label visibility when toggled or a new basemap style is selected
  useEffect(() => {
    const vis = showLabels ? "visible" : "none";

    if (mapRef?.current) {
      // @ts-ignore
      var layers = mapRef.current.map.getStyle().layers;

      // This will remove layer labels from the basemap, which tend to
      // repeat in a overwhelming way at low zoom levels
      layers.forEach((layer: any) => {
        if (
          layer.type === "symbol" &&
          layer.source === "vectorTiles" &&
          layer.layout &&
          layer.layout["text-field"] &&
          layer.layout["text-field"] !== ""
        ) {
          // @ts-ignore
          mapRef.current.map.setLayoutProperty(layer.id, "visibility", vis);
        }
      });
    }
  }, [showLabels, currentMapStyle]);

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
      map.events.add("styledata", e => {
        if (e.dataType === "style") {
          setCurrentMapStyle(e.map.getStyle().style || "");
        }
      });

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Remove event handlers on unmount
    return () => map.events.remove("ready", onReady);
  }, []);

  return (
    <Stack tokens={{ childrenGap: 15, padding: "20px 0" }}>
      <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="center">
        <Slider
          min={0}
          max={100}
          step={1}
          value={opacity}
          onChange={value => setOpacity(value)}
          label="Layer opacity"
          valueFormat={(value: number) => `${value}%`}
          styles={{ root: { width: 250 } }}
        />
        <Toggle
          label="Show labels"
          checked={showLabels}
          onChange={(_, checked) => setShowLabels(checked || false)}
        />
      </Stack>
      <div id={mapContainerId} style={{ width: "100%", height: "70vh" }}></div>
    </Stack>
  );
};

export default TileJsonViewer;
