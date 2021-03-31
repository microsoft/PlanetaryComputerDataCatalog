import React from "react";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import DefaultBanner from "../components/DefaultBanner";
import ResourceCard from "../components/ResourceCard";

import appConfig from "../config/apps.yml";

const Applications = () => {
  const banner = (
    <DefaultBanner>
      <h1>Applications</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
      </p>
    </DefaultBanner>
  );

  const appsList = appConfig.map(app => {
    return (
      <ResourceCard
        key={`card-${app.title}`}
        resourceItem={app}
        sourceLabel="Homepage"
        width={400}
      />
    );
  });

  return (
    <Layout bannerHeader={banner}>
      <SEO title="Applications" />
      <div className="datasource-container">
        <div className="datasource-row">{appsList}</div>
      </div>
    </Layout>
  );
};

export default Applications;
