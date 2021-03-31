import React from "react";
import { Link, Text } from "@fluentui/react";

import Resource from "../components/homepage/Resource";
import Section from "../components/homepage/Section";
import Layout from "../components/Layout";
import SEO from "../components/Seo";

const whiteText = {
  root: { color: "#fff" },
};
const Home = () => {
  const banner = (
    <div
      style={{
        background: "url(./images/earth-space-clip.2.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        height: "660px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div style={{ margin: "0 10%" }}>
        <Text
          block
          variant="mega"
          styles={{ root: { color: "#fff", maxWidth: 580, marginBottom: 40 } }}
        >
          A Planetary Computer for a Sustainable Future
        </Text>
        <Text block variant="large" styles={whiteText}>
          Empowering conservation with global-scale environmental data
        </Text>
      </div>
    </div>
  );
  const bannerFooter = (
    <>
      <Section title="Building a global environmental network">
        <Text
          block
          variant="large"
          style={{
            color: "#fff",
            marginBottom: 20,
          }}
        >
          The Planetary Computer is only as strong as the partner community that
          is building applications on it. If you are interested in scaling your
          environmental sustainability work with the power of the Azure cloud,{" "}
          <Link
            underline
            href="mailto:planetarycomputer@microsoft.com"
            style={{ color: "#fff", fontWeight: "600" }}
          >
            contact us
          </Link>
          .
        </Text>
        <Text
          block
          variant="large"
          style={{
            color: "#fff",
          }}
        >
          The Planetary Computer API and Hub are currently available in private
          preview; if you’re interested in developing on our platform,{" "}
          <Link
            underline
            to="/account/request"
            style={{ color: "#fff", fontWeight: "600" }}
          >
            request access now
          </Link>
          .
        </Text>
      </Section>
    </>
  );

  return (
    <Layout bannerHeader={banner} bannerFooter={bannerFooter}>
      <SEO title="Home" />
      <div
        style={{
          display: "flex",
          flexFlow: "column nowrap",
          alignItems: "center",
          marginTop: "80px",
        }}
      >
        <Text
          block
          variant="xxLarge"
          style={{ textAlign: "center", maxWidth: "515px" }}
        >
          Providing global environmental data for sustainability decision-making
        </Text>
        <Text
          block
          variant="large"
          style={{ margin: "1.8rem 0", textAlign: "center", maxWidth: "815px" }}
        >
          The Planetary Computer combines a multi-petabyte catalog of global
          environmental data with intuitive APIs, a flexible scientific
          environment that allows users to answer global questions about that
          data, and applications that put those answers in the hands of
          conservation stakeholders.
        </Text>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Resource title="Data Catalog">
          The Planetary Computer Data Catalog includes petabytes of
          environmental monitoring data, in consistent, analysis-ready formats,
          accessible through our APIs as well as directly available via Azure
          Storage.
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
