import React from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import DefaultBanner from "../components/DefaultBanner";

const Api = () => {
  const banner = (
    <DefaultBanner>
      <h1>Metadata and Data APIs</h1>
      <p style={{ margin: "1.8rem 0" }}>
        APIs that empower applications to monitor, model, and ultimately manage
        Earth's natural systems.
      </p>
    </DefaultBanner>
  );
  return (
    <Layout bannerHeader={banner} isShort>
      <SEO title="API" />
      <div className="layout-container">
        <div className="grid-content">
          <p>Introductory paragraph.</p>
          <div className="layout-row ">
            <div className="api-item">
              <h2>Open Access</h2>
              <p>Anyone can use the Planetary Computer APIs</p>
            </div>
            <div className="api-item">
              <h2>Open Standards</h2>
              <p>Enables access to data via open standards</p>
            </div>
            <div className="api-item">
              <h2>Open Source</h2>
              <p>Built by and for the open source community</p>
            </div>
          </div>

          <p>
            Outgoing paragraph. Link to{" "}
            <Link to="/docs">the documentation</Link>.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Api;
