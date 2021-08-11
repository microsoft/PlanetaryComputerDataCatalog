import { useEffect, useState, useRef, useCallback } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";
import { Stack, StackItem, IStackTokens } from "@fluentui/react";

import {
  stacSearchDatasource,
  itemLineLayer,
  itemPolyLayer,
  itemHoverLayer,
  layerControl,
  getHighlightItemFn,
  getUnhighlightItemFn,
} from "./components/viewerLayers";
import { IStacItem, IStacSearchResult } from "../../types/stac";
import Layout from "components/Layout";
import SEO from "components/Seo";
import { ExploreProvider } from "./components/state";
import ItemPanel from "./components/ItemPanel";
import SearchPane from "./components/panes/SearchPane";
import CollectionSelector from "./components/selectors/CollectionSelector";
import MosaicPane from "./components/panes/MosaicPane";

const mapContainerId: string = "viewer-map";

const Viewer = () => {
  const mapRef = useRef<atlas.Map | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<IStacSearchResult>();
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>();
  const [selectedItems, setSelectedItems] = useState<IStacItem[]>();

  const handleMapClick = useCallback((e: atlas.MapMouseEvent) => {
    if (e?.shapes?.length) {
      const shapes = e.shapes as atlas.Shape[];
      const ids = shapes.map(s => s.getId().toString());
      setSelectedItemIds(ids);
    }
  }, []);

  useEffect(() => {
    if (selectedItemIds) {
      const selected = searchResults?.features.filter(
        f => f.id && selectedItemIds.includes(f.id.toString())
      );
      setSelectedItems(selected);
    }
  }, [selectedItemIds, searchResults?.features]);

  useEffect(() => {
    const map = mapRef.current;

    if (mapReady && map && map.sources.getSources().length === 0) {
      map.sources.add(stacSearchDatasource);
      map.layers.add([itemPolyLayer, itemLineLayer, itemHoverLayer]);
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
        center: [-60, -20],
        zoom: 4,
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
      map.events.add("click", itemPolyLayer, handleMapClick);
      map.events.add("mousemove", itemPolyLayer, getHighlightItemFn(map));
      map.events.add("mouseleave", itemPolyLayer, getUnhighlightItemFn(map));

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Remove event handlers on unmount
    return () => map.events.remove("ready", onReady);
  }, [handleMapClick]);

  const handleResults = useCallback(
    (stacSearchResult: IStacSearchResult | undefined): void => {
      stacSearchDatasource.clear();
      if (stacSearchResult) {
        setSearchResults(stacSearchResult);
        setSelectedItems(undefined);
        setSelectedItemIds(undefined);
        stacSearchDatasource.add(stacSearchResult as atlas.data.FeatureCollection);
      }
    },
    []
  );

  const stackTokens: IStackTokens = {
    childrenGap: 5,
  };

  return (
    <Layout>
      <SEO title="Explorer" description="Explore Planetary Computer datasets" />
      <ExploreProvider>
        <ItemPanel selectedItems={selectedItems} />
        <Stack horizontal tokens={stackTokens} styles={{ root: { height: "94vh" } }}>
          <StackItem grow={1} styles={{ root: { maxWidth: "33%", margin: 5 } }}>
            <Stack tokens={stackTokens}>
              <p>Explore Planetary Computer datasets.</p>
              <CollectionSelector />
              <MosaicPane />
              <SearchPane mapRef={mapRef} onResults={handleResults} />
            </Stack>
          </StackItem>
          <StackItem grow={2}>
            <div id={mapContainerId} style={{ width: "100%", height: "100%" }}></div>
          </StackItem>
        </Stack>
      </ExploreProvider>
    </Layout>
  );
};

export default Viewer;
