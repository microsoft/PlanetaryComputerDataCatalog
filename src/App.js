import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import AccountSurvey from "./pages/AccountSurvey";

function App() {
  return (
    <Router>
      <Layout>
        <div>
          <Switch>
            <Route exact path="/">
              <Home />
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
