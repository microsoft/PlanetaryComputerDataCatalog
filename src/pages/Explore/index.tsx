import { Provider } from "react-redux";
import "azure-maps-control/dist/atlas.min.css";
import { Stack, StackItem, useTheme } from "@fluentui/react";

import { store } from "./state/store";
import "./explorer.css";

import Layout from "components/Layout";
import SEO from "components/Seo";
import ExploreMap from "./components/Map";
import Sidebar from "./components/Sidebar";
import { useWindowSize } from "react-use";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "components/ErrorFallback";

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
    <Layout onGrid={false} allowAnnouncement={false}>
      <SEO title="Explorer" description="Explore Planetary Computer datasets" />
      <Provider store={store}>
        <Stack horizontal styles={{ root: { height: bodyHeight } }}>
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
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <ExploreMap />
            </ErrorBoundary>
          </StackItem>
        </Stack>
      </Provider>
    </Layout>
  );
};

export default Explorer;
