import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { initializeIcons } from "@uifabric/icons";

import Datasets from "./pages/Datasets";
import Collection from "./pages/Collection";
import NotFound from "./pages/NotFound";
import AccountSurvey from "./pages/AccountSurvey";
import Compute from "./pages/Compute";
import ApiDocs from "./pages/ApiDocs";
import AppList from "./pages/AppList";
import { usePrefetchContent } from "./utils/requests";

function App() {
  initializeIcons();
  usePrefetchContent();
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div>
        <Switch>
          <Route exact path="/">
            <Datasets />
          </Route>
          <Route path="/docs/compute">
            <Compute />
          </Route>
          <Route path="/docs/api">
            <ApiDocs />
          </Route>
          <Route path="/apps">
            <AppList />
          </Route>
          <Route path="/collection/:id">
            <Collection />
          </Route>
          <Route path="/account/request">
            <AccountSurvey />
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
