import React, { Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { initializeIcons } from "@uifabric/icons";

import Catalog from "./pages/Catalog";
import Collection from "./pages/Collection";
import NotFound from "./pages/NotFound";
import AccountSurvey from "./pages/AccountSurvey";
import Docs from "./pages/Docs";
import Applications from "./pages/Applications";
import { usePrefetchContent } from "./utils/requests";
import Home from "./pages/Home";
import Terms from "./pages/Terms";
import { initializeFeatures } from "./utils/featureFlags";
import CatalogGroup from "./pages/CatalogGroup";
import Layout from "./components/Layout";

const Explore = React.lazy(() => import("./pages/Explore"));

function App() {
  initializeIcons(undefined, { disableWarnings: true });
  initializeFeatures();
  usePrefetchContent();

  const fallback = <Layout onGrid={false} isShort={true}></Layout>;

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/terms">
            <Terms />
          </Route>
          <Route exact path="/catalog">
            <Catalog />
          </Route>
          <Route path="/docs/">
            <Docs />
          </Route>
          <Route path="/applications">
            <Applications />
          </Route>
          <Route path="/dataset/group/:groupId">
            <CatalogGroup />
          </Route>
          <Route path="/dataset/:id">
            <Collection />
          </Route>
          <Route path="/account/request">
            <AccountSurvey />
          </Route>
          <Route path="/explore">
            <Suspense fallback={fallback}>
              <Explore />
            </Suspense>
          </Route>
          <Route path="/404">
            <NotFound />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
