import React from "react";
import PropTypes from "prop-types";

import { name, product } from "../config/site.yml";

import Header from "./Header";
import Footer from "./Footer";
import { ScrollToTopOnMount } from "./ScrollToTopOnMount";

const Layout = ({ bannerHeader, children }) => {
  return (
    <>
      <Header siteTitle={name} siteProduct={product} />
      <div>{bannerHeader}</div>
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <ScrollToTopOnMount />
        <main style={{ minHeight: "calc(100vh - 161px)" }}>{children}</main>
      </div>
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
