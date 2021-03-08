import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Layout from "./components/Layout";

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
          </Switch>
        </div>
      </Layout>
    </Router>
  );
}

export default App;
