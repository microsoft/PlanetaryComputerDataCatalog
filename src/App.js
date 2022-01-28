import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { initializeIcons } from "@uifabric/icons";

import Catalog from "./pages/Catalog";
import Collection from "./pages/Collection";
import NotFound from "./pages/NotFound";
import AccountSurvey from "./pages/AccountSurvey";
import Applications from "./pages/Applications";
import { usePrefetchContent } from "./utils/requests";
import Home from "./pages/Home";
import Terms from "./pages/Terms";
import { initializeFeatures } from "./utils/featureFlags";
import CatalogGroup from "./pages/CatalogGroup";
import Layout from "./components/Layout";
import { registerCustomIcons } from "utils/icons";

const Explore = React.lazy(() => import("./pages/Explore"));
const Docs = React.lazy(() => import("./pages/Docs"));

function App() {
  initializeIcons(undefined, { disableWarnings: true });
  registerCustomIcons();
  initializeFeatures();
  usePrefetchContent();

  const pageFallback = (
    <Layout onGrid={false} isShort={true} allowAnnouncement={false}></Layout>
  );

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route
            path="/docs/*"
            element={
              <Suspense fallback={pageFallback}>
                <Docs />
              </Suspense>
            }
          />
          <Route path="/applications" element={<Applications />} />
          <Route path="/dataset/group/:groupId" element={<CatalogGroup />} />
          <Route path="/dataset/:id" element={<Collection />} />
          <Route path="/account/request" element={<AccountSurvey />} />
          <Route
            path="/explore"
            element={
              <Suspense fallback={pageFallback}>
                <Explore />
              </Suspense>
            }
          />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
