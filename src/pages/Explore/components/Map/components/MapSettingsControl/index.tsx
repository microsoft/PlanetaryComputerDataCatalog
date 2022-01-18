import { useEffect, useState } from "react";
import { Checkbox, Separator, Slider, Stack } from "@fluentui/react";
import * as atlas from "azure-maps-control";
import PanelControl from "../PanelControl";
import { mosaicLayerName } from "../../hooks/useMosaicLayer";
import { DEFAULT_MAP_STYLE } from "pages/Explore/utils/constants";
import CollectionBoundaryToggle from "./CollectionBoundaryToggle";
interface MapsOptionsControlProps {
  mapRef: React.MutableRefObject<atlas.Map | null>;
}

const MapSettingsControl = ({ mapRef }: MapsOptionsControlProps) => {
  const [opacity, setOpacity] = useState<number>(100);
  const [currentMapStyle, setCurrentMapStyle] = useState<string>(DEFAULT_MAP_STYLE);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // Update opacity when slider changes
  useEffect(() => {
    const mosaicLayer = mapRef?.current?.layers.getLayerById(mosaicLayerName);
    if (mosaicLayer) {
      (mosaicLayer as atlas.layer.TileLayer).setOptions({ opacity: opacity / 100 });
    }
  }, [mapRef, opacity]);

  // Set label visibility when toggled or a new basemap style is selected
  useEffect(() => {
    const vis = showLabels ? "visible" : "none";

    if (mapRef?.current) {
      // @ts-ignore - layers is not in the type definition
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
          // @ts-ignore - "visibility" isn't in the type definition
          mapRef.current.map.setLayoutProperty(layer.id, "visibility", vis);
        }
      });
    }
  }, [showLabels, currentMapStyle, mapRef]);

  useEffect(() => {
    mapRef.current?.events.add("styledata", e => {
      if (e.dataType === "style") {
        setCurrentMapStyle(e.map.getStyle().style || "");
      }
    });
  }, [mapRef]);

  const title = "Manage map settings";

  return (
    <PanelControl label={title} iconName="FluentSettings" top={178}>
      <Stack tokens={{ childrenGap: 10 }} styles={{ root: { padding: 4 } }}>
        <Slider
          min={0}
          max={100}
          step={1}
          value={opacity}
          onChange={value => setOpacity(value)}
          label="Layer opacity"
          valueFormat={(value: number) => `${value}%`}
          styles={{ root: { width: "100%" } }}
        />
        <Separator />
        <Checkbox
          label="Show map labels"
          checked={showLabels}
          onChange={(_, checked) => setShowLabels(checked || false)}
        />
        <CollectionBoundaryToggle />
      </Stack>
    </PanelControl>
  );
};

export default MapSettingsControl;
