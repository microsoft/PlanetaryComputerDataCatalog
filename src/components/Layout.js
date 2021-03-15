import React, { useState } from "react";
import PropTypes from "prop-types";

import { name, product } from "../config/site.yml";

import Header from "./Header";
import { ActionButton } from "@fluentui/react";
import { useTimeoutFn } from "react-use";

const Layout = ({ children }) => {
  // Allow users to manage their cookie consent preferences. Not all regions
  // require consent so check for requirements before rendering the button.
  const [isConsentRequired, setIsConsentRequired] = useState(false);
  useTimeoutFn(() => {
    // Cookie consent is determined regionally. If it can't be determined, default
    // to requiring consent.
    const consent = window?.siteConsent?.isConsentRequired;
    setIsConsentRequired(consent === undefined ? true : consent);
  }, 600);

  const manageConsent = isConsentRequired ? (
    <ActionButton
      onClick={() => window.siteConsent.manageConsent()}
      ariaDescription="Launch cookie consent form"
    >
      Manage Cookies
    </ActionButton>
  ) : null;

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
          {manageConsent} © Microsoft {new Date().getFullYear()}
        </footer>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
