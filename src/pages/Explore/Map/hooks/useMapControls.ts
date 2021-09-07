import * as atlas from "azure-maps-control";
import { useEffect } from "react";
import { layerControl } from "../../utils/layers";

// Setup tile layers and map controls
const useMapControls = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  mapReady: boolean
) => {
  useEffect(() => {
    const map = mapRef.current;

    if (!mapReady || !map) return;

    if (map.controls.getControls().length < 2) {
      map.controls.add(new atlas.control.ZoomControl(), {
        position: atlas.ControlPosition.TopRight,
      });
      map.controls.add(layerControl, {
        position: atlas.ControlPosition.TopRight,
      });
    }
  }, [mapReady, mapRef]);
};

export default useMapControls;
