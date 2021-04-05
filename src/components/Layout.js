import React from "react";
import PropTypes from "prop-types";

import { name, product } from "../config/site.yml";

import Header from "./Header";
import Footer from "./Footer";
import { ScrollToTopOnMount } from "./ScrollToTopOnMount";

const Layout = ({ bannerHeader, bannerFooter, isShort = false, children }) => {
  return (
    <>
      <Header siteTitle={name} siteProduct={product} />
      <div>{bannerHeader}</div>
      <ScrollToTopOnMount />
      <main
        className={isShort ? "short" : undefined}
        style={{ padding: "0 10%" }}
      >
        {children}
      </main>
      {bannerFooter}
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
