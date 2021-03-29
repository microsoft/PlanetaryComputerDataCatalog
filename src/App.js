import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { initializeIcons } from "@uifabric/icons";

import Datasets from "./pages/Datasets";
import Collection from "./pages/Collection";
import NotFound from "./pages/NotFound";
import AccountSurvey from "./pages/AccountSurvey";
import Docs from "./pages/Docs";
import Applications from "./pages/Applications";
import { usePrefetchContent } from "./utils/requests";
import Home from "./pages/Home";

function App() {
  initializeIcons();
  usePrefetchContent();
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/catalog">
            <Datasets />
          </Route>
          <Route path="/docs/">
            <Docs />
          </Route>
          <Route path="/apps">
            <Applications />
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
