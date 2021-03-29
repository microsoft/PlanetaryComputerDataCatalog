import { Text } from "@fluentui/react";
import React from "react";
import { Link } from "react-router-dom";

import DefaultBanner from "../components/DefaultBanner";
import Resource from "../components/homepage/Resource";
import Section from "../components/homepage/Section";
import Layout from "../components/Layout";
import SEO from "../components/Seo";

const Home = () => {
  const banner = (
    <DefaultBanner>
      <div>
        <Text block variant="superLarge">
          A Planetary Computer for a Sustainable Future
        </Text>
        <Text block>
          Empowering conservation with global-scale environmental data
        </Text>
      </div>
    </DefaultBanner>
  );
  const bannerFooter = (
    <>
      <Section title="Get involved">
        The Planetary Computer API and Hub are currently available in private
        preview; if you’re interested in developing on our platform,{" "}
        <Link to="/account/request">request an account now</Link>.
      </Section>
      <Section title="Building a global environmental network" color="#c4c4c4">
        The Planetary Computer is only as strong as the partner community that
        is building applications on it, so if you are interested in scaling your
        environmental sustainability work with the power of the Azure cloud,{" "}
        <Link href="mailto:planetarycomputer@microsoft.com">contact us</Link>.
      </Section>
    </>
  );

  return (
    <Layout bannerHeader={banner} bannerFooter={bannerFooter}>
      <SEO title="Home" />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Text block variant="large" style={{ margin: "1.8rem 0" }}>
          The Planetary Computer combines a multi-petabyte catalog of global
          environmental data with intuitive APIs, a flexible scientific
          environment that allows users to answer global questions about that
          data, and applications that put those answers in the hands of
          conservation stakeholders. With the launch of the Planetary Computer,
          Microsoft and our partners are closing the gap between global
          environmental data and sustainability decision-making.
        </Text>
        <Resource title="Data Catlog">
          The Planetary Computer Data Catalog includes petabytes of
          environmental monitoring data, in consistent, analysis-ready formats,
          accessible through our APIs as well as directly available via Azure
          Storage.j
        </Resource>
        <Resource title="API">
          The Planetary Computer API makes it easy for users to find exactly the
          data they need, simplifying search and discovery across our Data
          Catalog.
        </Resource>
        <Resource title="Hub">
          The Planetary Computer Hub is a development environment that makes our
          data and APIs accessible through familiar, open-source tools, and
          allows users to easily scale their analyses with the power of Azure
          compute.
        </Resource>
        <Resource title="Applications">
          Together with our partners in the conservation community, we are
          putting the Planetary Computer in the hands of stakeholders through
          applications that build on top of the Planetary Computer platform,
          providing the actionable information that is critical to
          sustainability practitioners.
        </Resource>
      </div>
    </Layout>
  );
};

export default Home;
