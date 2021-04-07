import React from "react";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import DefaultBanner from "../components/DefaultBanner";
import ApplicationCard from "../components/ApplicationCard";

import appConfig from "../config/apps.yml";

const Applications = () => {
  const banner = (
    <DefaultBanner>
      <h1>Applications</h1>
      <p style={{ margin: "1.8rem 0" }}>
        The Planetary Computer puts global-scale geospatial data in the hands of
        environmental scientists, application developers, and policy makers,
        enabling data-driven decision making. Learn about some of the
        applications our partners are building as part of the Planetary
        Computer.
      </p>
    </DefaultBanner>
  );

  const appsList = appConfig.map(app => {
    return <ApplicationCard key={`card-${app.title}`} app={app} />;
  });

  return (
    <Layout bannerHeader={banner} isShort>
      <SEO title="Applications" />
      <div className="layout-container">
        <div className="layout-row grid-content">{appsList}</div>
      </div>
    </Layout>
  );
};

export default Applications;
