import ReactDOM from "react-dom";
import { ThemeProvider } from "@fluentui/react";

import "./styles/index.css";
import App from "./App";

import collections from "config/datasets.yml";
import storageCollections from "config/storageDatasets.yml";
import groups from "config/datasetGroups.yml";
import featuredCollections from "config/datasetFeatured.yml";

import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "components/auth/hooks/SessionContext";
import { DataConfigProvider } from "components/state/DataConfigProvider";

const queryClient = new QueryClient();

ReactDOM.render(
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <DataConfigProvider
          collectionConfig={collections}
          storageCollectionConfig={storageCollections}
          groupConfig={groups}
          featuredIds={featuredCollections}
        >
          <App />
        </DataConfigProvider>
      </SessionProvider>
    </QueryClientProvider>
  </ThemeProvider>,
  document.getElementById("root")
);

// An example of how to build just the header component for embedding in other apps

// import Header from "./components/Header";
// import { BrowserRouter } from "react-router-dom";
// ReactDOM.render(
//   <ThemeProvider>
//     <BrowserRouter forceRefresh>
//       <Header />
//     </BrowserRouter>
//   </ThemeProvider>,
//   document.getElementById("root")
// );
