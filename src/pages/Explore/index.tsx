import { Provider } from "react-redux";
import "azure-maps-control/dist/atlas.min.css";
import { Stack, StackItem, IStackTokens } from "@fluentui/react";

import { store } from "./components/state/store";

import Layout from "components/Layout";
import SEO from "components/Seo";
// import ItemPanel from "./components/ItemPanel";
import CollectionSelector from "./components/selectors/CollectionSelector";
import MosaicPane from "./components/panes/MosaicPane";
import CollectionDetailPane from "./components/panes/CollectionDetailPane";
import ExploreMap from "./components/Map";
import TemporarySearch from "./components/TemporarySearch";

const Viewer = () => {
  const stackTokens: IStackTokens = {
    childrenGap: 5,
  };

  return (
    <Layout>
      <SEO title="Explorer" description="Explore Planetary Computer datasets" />
      <Provider store={store}>
        {/* <ItemPanel selectedItems={selectedItems} /> */}
        <Stack horizontal tokens={stackTokens} styles={{ root: { height: "94vh" } }}>
          <StackItem grow={1} styles={{ root: { maxWidth: "33%", margin: 5 } }}>
            <Stack styles={{ root: { height: "100%" } }} tokens={stackTokens}>
              <p>
                Explore Planetary Computer datasets. Explains filters and results.
              </p>
              <CollectionSelector />
              <MosaicPane />
              <CollectionDetailPane />
              <TemporarySearch />
            </Stack>
          </StackItem>
          <StackItem grow={2}>
            <ExploreMap />
          </StackItem>
        </Stack>
      </Provider>
    </Layout>
  );
};

export default Viewer;
