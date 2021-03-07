import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useQuery } from "react-query";

import { getCollections } from "./utils/requests";

import Collection from "./components/Collection";

function App() {
  const query = useQuery("stac", getCollections);

  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {query.isLoading ? (
            <div>Loading...</div>
          ) : (
            query.data.links
              .filter((l) => l.rel === "child")
              .map((c) => {
                return (
                  <li key={c.href}>
                    <Link
                      to={{
                        pathname: `/collection/${c.href.split("/").pop()}`,
                        state: { href: c.href },
                      }}
                    >
                      {c.title}
                    </Link>
                  </li>
                );
              })
          )}
        </ul>

        <hr />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/collection/:id">
            <Collection />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

export default App;
