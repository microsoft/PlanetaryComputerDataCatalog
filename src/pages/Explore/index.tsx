import { Provider } from "react-redux";
import "azure-maps-control/dist/atlas.min.css";
import { Stack, StackItem, IStackTokens, useTheme } from "@fluentui/react";

import { store } from "./state/store";

import Layout from "components/Layout";
import SEO from "components/Seo";
import ExploreMap from "./components/Map";
import Sidebar from "./components/Sidebar";
import { useWindowSize } from "react-use";

const stackTokens: IStackTokens = {
  childrenGap: 5,
};

// TODO: track heights rather than hard code them
const heights = {
  header: 57.5,
  footer: 27,
  buffer: 2,
};

const Explorer = () => {
  const theme = useTheme();
  const { height } = useWindowSize();

  const bodyHeight = height - heights.header - heights.footer - heights.buffer;

  return (
    <Layout onGrid={false}>
      <SEO title="Explorer" description="Explore Planetary Computer datasets" />
      <Provider store={store}>
        <Stack
          horizontal
          tokens={stackTokens}
          styles={{ root: { height: bodyHeight } }}
        >
          <Sidebar />
          <StackItem
            styles={{
              root: {
                borderLeft: "1px solid",
                borderLeftColor: theme.palette.neutralLight,
              },
            }}
            grow={1}
          >
            <ExploreMap />
          </StackItem>
        </Stack>
      </Provider>
    </Layout>
  );
};

export default Explorer;
