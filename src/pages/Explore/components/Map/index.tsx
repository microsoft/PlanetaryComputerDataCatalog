import { useEffect, useState, useRef } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";

import { useExploreSelector } from "../../state/hooks";
import {
  useMosaicLayer,
  useItemBoundsLayer,
  useMapEvents,
  useMapDrawTools,
  useZoomEvents,
  useMapControls,
  useMapZoomToLayer,
  useMapZoomToExtent,
  useCollectionBoundsLayer,
  useUrlState,
} from "./hooks";
import { ZoomMessage, ExtentMessage } from "../controls/MapMessages";

import PlaceSearchControl from "./components/PlaceSearch";
import {
  IStyleFunctionOrObject,
  IProgressIndicatorStyleProps,
  IProgressIndicatorStyles,
  ProgressIndicator,
} from "@fluentui/react";
import MapSettingsControl from "./components/MapSettingsControl";
import { DEFAULT_MAP_STYLE } from "pages/Explore/utils/constants";
import LegendControl from "./components/LegendControl";
import { MobileViewSidebarButton } from "../MobileViewInMap/ViewInMap.index";
import { addEntityHeader, fetchMapToken } from "./helpers";
import { PreviewMessage } from "./components/ItemPreview/PreviewMessage";
import { AZMAPS_CLIENT_ID } from "utils/constants";

const mapContainerId: string = "viewer-map";

const ExploreMap = () => {
  const mapRef = useRef<atlas.Map | null>(null);
  const { center, zoom, showSidebar } = useExploreSelector(s => s.map);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const mapHandlers = useMapEvents(mapRef);
  // const { status: sessionStatus } = useSession();

  // Initialize the map
  useEffect(() => {
    const onReady = () => {
      setMapReady(true);
    };

    if (!mapRef.current) {
      const map = new atlas.Map(mapContainerId, {
        view: "Auto",
        center: center,
        zoom: zoom,
        language: "en-US",
        showFeedbackLink: false,
        showLogo: false,
        style: DEFAULT_MAP_STYLE,
        renderWorldCopies: true,
        authOptions: {
          authType: atlas.AuthenticationType.anonymous,
          clientId: AZMAPS_CLIENT_ID,
          getToken: fetchMapToken,
        },
        transformRequest: addEntityHeader,
      });

      map.events.add("ready", onReady);
      map.events.add("moveend", mapHandlers.onMapMove);
      map.events.add("styledata", mapHandlers.onStyleDataLoaded);
      map.events.add("data", mapHandlers.onDataEvent);

      mapRef.current = map;
    }
  }, [
    center,
    zoom,
    mapHandlers.onMapMove,
    mapHandlers.onStyleDataLoaded,
    mapHandlers.onDataEvent,
  ]);

  useEffect(() => {
    // Azure maps is putting 2 shortcut elements with the same id on the page,
    // and it's causing an accessibility error.
    const elNames = ["#atlas-map-shortcuts", "#atlas-map-style", "#atlas-map-state"];
    elNames.forEach(elName => {
      const els = document.querySelectorAll(elName);
      if (els.length === 2) {
        els[1].remove();
      }
    });
  }, [mapReady]);

  // When logged in, transform requests to include auth header
  // useEffect(() => {
  //   if (sessionStatus.isLoggedIn) {
  //     console.log("Activating auth headers for tile requests");
  //     mapRef.current?.setServiceOptions({ transformRequest: addAuthHeaders });
  //   } else {
  //     mapRef.current?.setServiceOptions({
  //       transformRequest: () => {
  //         return {};
  //       },
  //     });
  //   }
  // }, [addAuthHeaders, sessionStatus]);

  useItemBoundsLayer(mapRef, mapReady);
  useCollectionBoundsLayer(mapRef, mapReady);
  useMosaicLayer(mapRef, mapReady);
  useZoomEvents(mapRef);
  useMapControls(mapRef, mapReady);
  useUrlState();
  useMapDrawTools(mapRef, mapReady);

  const { zoomToLayer, showZoomMsg, nonVisibleLayers } = useMapZoomToLayer();
  const zoomMsg = (
    <ZoomMessage onClick={zoomToLayer} layerVisibility={nonVisibleLayers} />
  );

  const { showExtentMsg, zoomToExtent } = useMapZoomToExtent(mapRef);
  const extentMsg = (
    <ExtentMessage onClick={zoomToExtent} layerVisibility={nonVisibleLayers} />
  );

  const loadingIndicator = (
    <ProgressIndicator
      aria-label="Map tile loading indicator"
      barHeight={1}
      styles={progressIndicatorStyles}
    />
  );

  // Class used to sync state via responsive media queries in css
  const visibilityClass = !showSidebar ? "explorer-sidebar-hidden" : "";

  return (
    <div className={`explorer-map ${visibilityClass}`} style={mapContainerStyle}>
      {mapHandlers.areTilesLoading && loadingIndicator}
      {showZoomMsg && zoomMsg}
      {showExtentMsg && extentMsg}
      <PreviewMessage mapRef={mapRef} />
      <PlaceSearchControl mapRef={mapRef} />
      <MapSettingsControl mapRef={mapRef} />
      <LegendControl />
      <MobileViewSidebarButton />
      <div id={mapContainerId} style={mapElementStyle} />
    </div>
  );
};

export default ExploreMap;

const mapContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
};

const mapElementStyle = { width: "100%", height: "100%" };

const progressIndicatorStyles: IStyleFunctionOrObject<
  IProgressIndicatorStyleProps,
  IProgressIndicatorStyles
> = {
  root: { position: "absolute", width: "100%", zIndex: 1 },
  itemProgress: { padding: 0 },
};
