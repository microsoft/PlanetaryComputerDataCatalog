import React, { Suspense } from "react";
import { Link, Route, Switch } from "react-router-dom";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import RoutedHtml from "../components/docs/RoutedHtml";
import Topic from "../components/docs/Topic";
import { Spinner, SpinnerSize } from "@fluentui/react";
const OpenApiSpec = React.lazy(() => import("../components/docs/OpenApiSpec"));

// Import all the JSON files that were copied into src/docs
// from the documentation build step
const jsonFileContexts = require.context("../docs/", true, /\.json$/);
const docTopics = Object.fromEntries(
  jsonFileContexts.keys().map(key => [key, jsonFileContexts(key)])
);

const Docs = () => {
  const openApiSpecRoute = "/docs/api/reference";
  const toc = docTopics["./index.json"].body;

  const links = (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          flexBasis: "10rem",
          flexGrow: 1,
        }}
      >
        <Link to={openApiSpecRoute}>API Reference</Link>
        <RoutedHtml className="toc-item" markup={toc} />
      </div>
      <div
        style={{ flexBasis: "0", flexGrow: 999, minWidth: "calc(50% - 1rem)" }}
      >
        <Switch>
          <Route path={openApiSpecRoute}>
            <Suspense fallback={<Spinner size={SpinnerSize.large} />}>
              <OpenApiSpec />
            </Suspense>
          </Route>
          <Route path={`/docs/:topicId/:fileId`}>
            <Topic topics={docTopics} />
          </Route>
          <Route path={"/docs"}>
            <h2>Documentation</h2>
            <p>
              The Planetary Computer consists of an API layer as well as
              Compute. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </Route>
        </Switch>
      </div>
    </div>
  );

  return (
    <Layout isShort>
      <SEO
        title="Documentation"
        description="User guides and reference material for using the Planetary Computer."
      />
      {links}
    </Layout>
  );
};

export default Docs;
