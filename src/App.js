import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { initializeIcons } from "@uifabric/icons";

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
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
      <Layout>
        <div>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/compute-docs">
              <Compute />
            </Route>
            <Route path="/api-docs">
              <ApiDocs />
            </Route>
            <Route path="/apps">
              <AppList />
            </Route>
            <Route path="/collection/:id">
              <Collection />
            </Route>
            <Route path="/404">
              <NotFound />
            </Route>
            <Route path="/account/request">
              <AccountSurvey />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </div>
      </Layout>
    </Router>
  );
}

export default App;
