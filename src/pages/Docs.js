import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import RoutedHtml from "../components/docs/RoutedHtml";
import Topic from "../components/docs/Topic";
import TocTreeItem from "../components/docs/TocTreeItem";
import { DQE_URL, MQE_URL } from "../utils/constants";

const OpenApiSpec = React.lazy(() => import("../components/docs/OpenApiSpec"));

// Import all the JSON files that were copied into src/docs
// from the documentation build step
const jsonFileContexts = require.context("../docs/", true, /\.json$/);
const docTopics = Object.fromEntries(
  jsonFileContexts.keys().map(key => [key, jsonFileContexts(key)])
);

const Docs = () => {
  // Generate Sphinx-like TOC items to inject into the generated TOC. Use these
  // for OpenAPI/Swagger routes.
  const openApiStacRoute = "/docs/api/spec/stac";
  const openApiDataRoute = "/docs/api/spec/data";
  const openApiLinks = [
    { label: "Metadata API", href: openApiStacRoute },
    { label: "Data API", href: openApiDataRoute },
  ];

  const apiRefTocItem = (
    <TocTreeItem title="API Reference" links={openApiLinks} />
  );

  const toc = docTopics["./index.json"].body;

  const documentationPane = (
    <div
      className="grid-content"
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
        <RoutedHtml className="toc-item" markup={toc}>
          {apiRefTocItem}
        </RoutedHtml>
      </div>
      <div
        style={{ flexBasis: "0", flexGrow: 999, minWidth: "calc(50% - 1rem)" }}
      >
        <Switch>
          <Route exact path={openApiStacRoute}>
            <Suspense fallback={<div />}>
              <OpenApiSpec specUrl={`${MQE_URL}/openapi.json`} />
            </Suspense>
          </Route>
          <Route title="Data API Reference" path={openApiDataRoute}>
            <Suspense fallback={<div />}>
              <OpenApiSpec specUrl={`${DQE_URL}/openapi.json`} />
            </Suspense>
          </Route>
          <Route path={`/docs/:topicId/:fileId`}>
            <Topic topics={docTopics} />
          </Route>
          <Route exact path={"/docs"}>
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
      {documentationPane}
    </Layout>
  );
};

export default Docs;
