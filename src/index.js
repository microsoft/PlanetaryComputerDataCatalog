import ReactDOM from "react-dom";
import { ThemeProvider } from "@fluentui/react";

import "./styles/index.css";
import App from "./App";

import collections from "config/datasets.yml";
import storageCollections from "config/storageDatasets.yml";
import groups from "config/datasetGroups.yml";
import featuredCollections from "config/datasetFeatured.yml";

import { QueryClient, QueryClientProvider } from "react-query";
import { DataConfigProvider } from "components/state/DataConfigProvider";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "utils/helpers/auth";

const queryClient = new QueryClient();

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.render(
  <ThemeProvider>
    <MsalProvider instance={msalInstance}>
      <QueryClientProvider client={queryClient}>
        <DataConfigProvider
          collectionConfig={collections}
          storageCollectionConfig={storageCollections}
          groupConfig={groups}
          featuredIds={featuredCollections}
        >
          <App />
        </DataConfigProvider>
      </QueryClientProvider>
    </MsalProvider>
  </ThemeProvider>,
  document.getElementById("root")
);
