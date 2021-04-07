import React from "react";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import DefaultBanner from "../components/DefaultBanner";

const Api = () => {
  const banner = (
    <DefaultBanner>
      <h1>Metadata and Data APIs</h1>
      <p style={{ margin: "1.8rem 0" }}>
        Lorem ipsum about the API, STAC, and open source.
      </p>
    </DefaultBanner>
  );
  return (
    <Layout bannerHeader={banner} isShort>
      <SEO title="API" />
      <div className="layout-container">
        <div className="layout-row">Content for API tbd.</div>
      </div>
    </Layout>
  );
};

export default Api;
