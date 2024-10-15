import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Link, Panel, PanelType, Text } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";

import Layout from "../../components/Layout";
import SEO from "../../components/Seo";
import DocsHtmlContent from "./components/DocsHtmlContent";
import Topic from "./components/Topic";
import { DATA_URL, SAS_URL, STAC_URL } from "../../utils/constants";
import ScrollToTop from "../../components/ScrollToTop";
import { skipContentStyle } from "components/Header/styles";

const OpenApiSpec = React.lazy(() => import("./components/OpenApiSpec"));

// Import all the JSON files that were copied into src/docs
// from the documentation build step.

// TODO: Jest tests can't parse require.context, so this module cannot be tested
// as a result. Resolve this by transforming the sphinx output into an actual
// named import and remove the dynamic import.
// @ts-ignore-next-line
const jsonFileContexts = require.context("../../docs/", true, /\.json$/);
const docTopics = Object.fromEntries(
  jsonFileContexts.keys().map((key: string) => [key, jsonFileContexts(key)])
);

const Docs = () => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const toc = docTopics["./index.json"];
  const tocComponent = (
    <nav
      className="docs-toc-nav"
      style={{
        flexBasis: "10rem",
        flexGrow: 1,
      }}
    >
      <DocsHtmlContent className="toc-item" markupJson={toc} />
    </nav>
  );

  const breadcrumb = (
    <>
      <Text block className="overflow-docs-nav" styles={breadCrumbStyles}>
        Documentation &gt; <Link onClick={() => openPanel()}>Table of Contents</Link>
      </Text>
      <Panel
        isLightDismiss
        isOpen={isOpen}
        onDismiss={dismissPanel}
        type={PanelType.smallFixedNear}
        onClick={dismissPanel}
      >
        <h3>Table of Contents</h3>
        <DocsHtmlContent className="toc-item-panel" markupJson={toc} />
      </Panel>
    </>
  );

  const documentationPane = (
    <div className="grid-content" style={docPageStyle}>
      <Link className={skipContentStyle} onClick={() => {
        const urlWithoutHash = window.location.href.split('#')[0];
        window.location.href = urlWithoutHash + "#generated-docs-content"
      }} >
        Skip to content
      </Link>
      {tocComponent}
      <div style={docContentStyle}>
        {breadcrumb}
        <ScrollToTop />
        <Routes>
          <Route
            path={"/reference/stac"}
            element={
              <Suspense fallback={<div />}>
                <OpenApiSpec specUrl={`${STAC_URL}/openapi.json`} />
              </Suspense>
            }
          />
          <Route
            path={"/reference/sas"}
            element={
              <Suspense fallback={<div />}>
                <OpenApiSpec specUrl={`${SAS_URL}/openapi.json`} />
              </Suspense>
            }
          />
          <Route
            path={"/reference/data"}
            element={
              <Suspense fallback={<div />}>
                <OpenApiSpec specUrl={`${DATA_URL}/openapi.json`} />
              </Suspense>
            }
          />
          <Route path={`/:topicId/:fileId`} element={<Topic topics={docTopics} />} />
          <Route
            path={"/"}
            element={<Navigate replace to="/docs/overview/about" />}
          />
        </Routes>
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

const breadCrumbStyles = { root: { paddingTop: 20, display: "none" } };
const docPageStyle: Partial<React.CSSProperties> = {
  display: "flex",
  flexWrap: "wrap",
};
const docContentStyle = {
  flexBasis: "0",
  flexGrow: 999,
  minWidth: "calc(50% - 1rem)",
};
