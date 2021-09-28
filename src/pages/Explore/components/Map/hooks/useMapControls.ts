import * as atlas from "azure-maps-control";
import { useEffect } from "react";
import { layerControl } from "../../../utils/layers";

// Setup tile layers and map controls
const useMapControls = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  mapReady: boolean
) => {
  useEffect(() => {
    const map = mapRef.current;

    if (!mapReady || !map) return;

    const controls: atlas.Control[] = [
      new atlas.control.CompassControl(),
      new atlas.control.ZoomControl(),
      layerControl,
    ];

    if (map.controls.getControls().length < controls.length) {
      map.controls.add(controls, {
        position: atlas.ControlPosition.TopRight,
      });
    }
  }, [mapReady, mapRef]);
};

export default useMapControls;
