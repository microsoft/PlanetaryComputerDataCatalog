import React from "react";
import { Link, Text } from "@fluentui/react";
import { Link as RouterLink } from "react-router-dom";

import Resource from "../components/homepage/Resource";
import Layout from "../components/Layout";
import SEO from "../components/Seo";
import ImageStrip from "../components/homepage/ImageStrip";

const Home = () => {
  const banner = (
    <div
      className="hero"
      style={{
        background: "url(./images/planet-sunrise-wide@1.jpg)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        height: "650px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div className="grid-content">
        <Text
          block
          variant="mega"
          className="title"
          styles={{
            root: {
              color: "#fff",
              maxWidth: 580,
              marginBottom: 40,
              fontWeight: 100,
            },
          }}
        >
          A Planetary Computer for a Sustainable Future
        </Text>
      </div>
    </div>
  );

  const bannerFooter = (
    <>
      <ImageStrip />
      <div className="home-footer-container">
        <div className="home-footer-grid grid-content">
          <Text
            block
            variant="xxLargePlus"
            className="home-footer-item"
            style={{ color: "#fff" }}
          >
            Building a global environmental network
          </Text>
          <div className="home-footer-item">
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
              environmental sustainability work with the power of the cloud,{" "}
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
              The Planetary Computer API and Hub are currently available in 
              preview. If you're interested in developing on our platform,{" "}
              <RouterLink
                to="/account/request"
                style={{
                  color: "#fff",
                  fontWeight: "600",
                  textDecoration: "underline",
                }}
              >
                request access now
              </RouterLink>
              .
              <p>
                Learn more about Microsoft's{" "}
                <Link
                  underline
                  href="https://www.microsoft.com/en-us/corporate-responsibility/sustainability"
                  style={{ color: "#fff", fontWeight: "600" }}
                >
                  commitment to sustainability
                </Link>
                .
              </p>
            </Text>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Layout bannerHeader={banner} bannerFooter={bannerFooter}>
      <SEO title="Home" />
      <div
        className="grid-content"
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
          style={{ textAlign: "center", maxWidth: "550px" }}
        >
          Supporting sustainability decision-making with the power of the cloud
        </Text>
        <Text
          block
          variant="large"
          style={{ margin: "1.8rem 0", textAlign: "center", maxWidth: "815px" }}
        >
          The Planetary Computer combines a multi-petabyte catalog of global
          environmental data with intuitive APIs, a flexible scientific environment
          that allows users to answer global questions about that data, and
          applications that put those answers in the hands of conservation
          stakeholders.
        </Text>
      </div>
      <div className="home-resources layout-container">
        <div className="layout-row grid-content">
          <Resource title="Data Catalog" iconName="ExploreData" to="/catalog">
            The Planetary Computer includes petabytes of environmental monitoring
            data, in consistent, analysis-ready formats, accessible through our APIs
            as well as directly available via Azure Storage.
          </Resource>
          <Resource title="API" iconName="Code" to="/docs">
            The Planetary Computer API makes it easy for users to find exactly the
            data they need, simplifying search and discovery across our Data Catalog.
          </Resource>
          <Resource title="Hub" iconName="TableComputed" href="/compute">
            The Planetary Computer Hub is a development environment that makes our
            data and APIs accessible through familiar, open-source tools, and allows
            users to easily scale their analyses.
          </Resource>
          <Resource
            title="Applications"
            iconName="WebAppBuilderFragmentCreate"
            to="/applications"
          >
            Partners all over the world are building on top of the Planetary Computer
            platform, providing the actionable information that is critical to
            sustainability practitioners.
          </Resource>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
