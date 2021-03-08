import * as React from "react";
import PropTypes from "prop-types";

import { name, product } from "../config/site.yml";

import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header siteTitle={name} siteProduct={product} />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <main>{children}</main>
        <footer
          style={{
            marginTop: `2rem`,
          }}
        >
          © Microsoft {new Date().getFullYear()}
        </footer>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
