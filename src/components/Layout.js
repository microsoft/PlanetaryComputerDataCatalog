import React from "react";
import PropTypes from "prop-types";

import { name, product } from "../config/site.yml";

import Header from "./Header";
import Footer from "./Footer";
import { ScrollToTopOnMount } from "./ScrollToTopOnMount";

const Layout = ({ bannerHeader, bannerFooter, children }) => {
  return (
    <>
      <Header siteTitle={name} siteProduct={product} />
      <div>{bannerHeader}</div>
      <div
        style={{
          padding: "0 5%",
        }}
      >
        <ScrollToTopOnMount />
        <main style={{ minHeight: "calc(100vh - 161px)" }}>{children}</main>
      </div>
      {bannerFooter}
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
