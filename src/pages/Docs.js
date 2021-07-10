import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import DocsHtmlContent from "../components/docs/DocsHtmlContent";
import Topic from "../components/docs/Topic";
import { DATA_URL, SAS_URL, STAC_URL } from "../utils/constants";
import ScrollToTop from "../components/ScrollToTop";

const OpenApiSpec = React.lazy(() => import("../components/docs/OpenApiSpec"));

// Import all the JSON files that were copied into src/docs
// from the documentation build step.

// TODO: Jest tests can't parse require.context, so this module cannot be tested
// as a result. Resolve this by transforming the sphinx output into an actual
// named import and remove the dynamic import.
const jsonFileContexts = require.context("../docs/", true, /\.json$/);
const docTopics = Object.fromEntries(
  jsonFileContexts.keys().map(key => [key, jsonFileContexts(key)])
);

const Docs = () => {
  // Routes that are generated via the docs build system, but are matched with
  // specialized React components for OpenAPI/Swagger routes.
  const openApiStacRoute = "/docs/reference/stac";
  const openApiSasRoute = "/docs/reference/sas";
  const openApiDataRoute = "/docs/reference/data";

  const toc = docTopics["./index.json"];
  const tocComponent = (
    <nav
      style={{
        flexBasis: "10rem",
        flexGrow: 1,
      }}
    >
      <DocsHtmlContent className="toc-item" markupJson={toc} />
    </nav>
  );

  const documentationPane = (
    <div
      className="grid-content"
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {tocComponent}
      <div style={{ flexBasis: "0", flexGrow: 999, minWidth: "calc(50% - 1rem)" }}>
        <ScrollToTop />
        <Switch>
          <Route title="STAC API Reference" exact path={openApiStacRoute}>
            <Suspense fallback={<div />}>
              <OpenApiSpec specUrl={`${STAC_URL}/openapi.json`} />
            </Suspense>
          </Route>
          <Route title="SAS API Reference" path={openApiSasRoute}>
            <Suspense fallback={<div />}>
              <OpenApiSpec specUrl={`${SAS_URL}/openapi.json`} />
            </Suspense>
          </Route>
          <Route title="Data API Reference" path={openApiDataRoute}>
            <Suspense fallback={<div />}>
              <OpenApiSpec specUrl={`${DATA_URL}/openapi.json`} />
            </Suspense>
          </Route>
          <Route path={`/docs/:topicId/:fileId`}>
            <Topic topics={docTopics} />
          </Route>
          <Route exact path={"/docs"}>
            <Redirect to="/docs/overview/about" />
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
