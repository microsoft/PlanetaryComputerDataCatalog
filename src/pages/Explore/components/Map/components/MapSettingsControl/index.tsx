import { useEffect, useState } from "react";
import {
  FontWeights,
  Separator,
  Slider,
  Stack,
  StackItem,
  Text,
  Toggle,
} from "@fluentui/react";
import * as atlas from "azure-maps-control";
import PanelControl from "../PanelControl";
import { mosaicLayerName } from "../../hooks/useMosaicLayer";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setShowCollectionOutline } from "pages/Explore/state/mapSlice";
import { INIT_MAP_STYLE } from "pages/Explore/utils/constants";
interface MapsOptionsControlProps {
  mapRef: React.MutableRefObject<atlas.Map | null>;
}

const MapSettingsControl = ({ mapRef }: MapsOptionsControlProps) => {
  const dispatch = useExploreDispatch();
  const { showCollectionOutline } = useExploreSelector(s => s.map);
  const [opacity, setOpacity] = useState<number>(100);
  const [currentMapStyle, setCurrentMapStyle] = useState<string>(INIT_MAP_STYLE);
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
          // @ts-ignore - "visbility" isn't in the type definition
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
    <PanelControl label={title} iconName="Settings" top={142}>
      <Stack tokens={{ childrenGap: 10 }} styles={{ root: { padding: 4 } }}>
        <StackItem>
          <Text styles={{ root: { fontWeight: FontWeights.bold } }}>{title}</Text>
          <Separator />
        </StackItem>
        <Slider
          min={0}
          max={100}
          step={1}
          value={opacity}
          onChange={value => setOpacity(value)}
          label="Mosaic layer opacity"
          valueFormat={(value: number) => `${value}%`}
          styles={{ root: { width: 250 } }}
        />
        <Toggle
          label="Show labels on map"
          checked={showLabels}
          onChange={(_, checked) => setShowLabels(checked || false)}
        />
        <Toggle
          label="Show current dataset extent on map"
          checked={showCollectionOutline}
          onChange={(_, checked) =>
            dispatch(setShowCollectionOutline(checked || false))
          }
        />
      </Stack>
    </PanelControl>
  );
};

export default MapSettingsControl;
