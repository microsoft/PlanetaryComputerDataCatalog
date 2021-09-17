import { useEffect, useState, useRef } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";

import { useExploreSelector } from "../../state/hooks";
import {
  useMosaicLayer,
  useItemBoundsLayer,
  useMapEvents,
  useZoomEvents,
  useMapControls,
  useMapZoomToLayer,
  useMapZoomToExtent,
  useCollectionBoundsLayer,
} from "./hooks";
import { ZoomMessage, ExtentMessage } from "../controls/MapMessages";

import PlaceSearchControl from "./components/PlaceSearch";
import {
  IStyleFunctionOrObject,
  IProgressIndicatorStyleProps,
  IProgressIndicatorStyles,
  ProgressIndicator,
} from "@fluentui/react";

const mapContainerId: string = "viewer-map";

const ExploreMap = () => {
  const mapRef = useRef<atlas.Map | null>(null);
  const { center, zoom } = useExploreSelector(s => s.map);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const mapHandlers = useMapEvents(mapRef);

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
        maxBounds: [-180, -90, 180, 90],
        authOptions: {
          authType: atlas.AuthenticationType.subscriptionKey,
          subscriptionKey: process.env.REACT_APP_AZMAPS_KEY,
        },
      });

      map.events.add("ready", onReady);
      map.events.add("moveend", mapHandlers.onMapMove);
      map.events.add("styledata", mapHandlers.onStyleDataLoaded);
      map.events.add("data", mapHandlers.onDataEvent);

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Remove event handlers on unmount
    return () => map.events.remove("ready", onReady);
  }, [
    center,
    zoom,
    mapHandlers.onMapMove,
    mapHandlers.onStyleDataLoaded,
    mapHandlers.onDataEvent,
  ]);

  useItemBoundsLayer(mapRef, mapReady);
  useCollectionBoundsLayer(mapRef, mapReady);
  useMosaicLayer(mapRef, mapReady);
  useZoomEvents(mapRef);
  useMapControls(mapRef, mapReady);

  const { zoomToLayer, showZoomMsg } = useMapZoomToLayer();
  const zoomMsg = <ZoomMessage onClick={zoomToLayer} />;

  const { showExtentMsg, zoomToExtent } = useMapZoomToExtent(mapRef);
  const extentMsg = <ExtentMessage onClick={zoomToExtent} />;
  const loadingIndicator = (
    <ProgressIndicator barHeight={1} styles={progressIndicatorStyles} />
  );

  return (
    <div style={mapContainerStyle}>
      {mapHandlers.areTilesLoading && loadingIndicator}
      {showZoomMsg && zoomMsg}
      {showExtentMsg && extentMsg}
      <PlaceSearchControl mapRef={mapRef} />
      <div id={mapContainerId} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default ExploreMap;

const mapContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
};

const progressIndicatorStyles: IStyleFunctionOrObject<
  IProgressIndicatorStyleProps,
  IProgressIndicatorStyles
> = {
  root: { position: "absolute", width: "100%", zIndex: 1 },
  itemProgress: { padding: 0 },
};
