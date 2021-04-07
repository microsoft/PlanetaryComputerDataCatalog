import * as React from "react";
import PropTypes from "prop-types";
import { Stack, Text } from "@fluentui/react";
import HeaderLink from "./controls/HeaderLink";

const Header = ({ siteProduct }) => (
  <header
    style={{
      background: "#fff",
    }}
  >
    <div
      className="grid-content"
      style={{
        paddingTop: "6px",
      }}
    >
      <Stack
        className="inner-header"
        horizontal
        wrap
        tokens={{ childrenGap: "10px" }}
      >
        <a
          id="uhfLogo"
          itemProp="url"
          href="https://www.microsoft.com"
          aria-label="Microsoft"
          style={{
            padding: "16px 0 16px 0px",
            float: "left",
            height: "100%",
            width: "113px",
            outlineOffset: "-2px",
          }}
        >
          <img
            alt=""
            itemProp="logo"
            src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31"
            role="presentation"
            aria-hidden="true"
            style={{
              marginTop: "-3px",
              maxWidth: "none",
              width: "108px",
            }}
          />
        </a>
        <span
          style={{
            fontSize: 22,
            fontWeight: 600,
            marginTop: 13,
            marginRight: 15,
          }}
        >
          |
        </span>
        <HeaderLink to="/" style={{ marginTop: "-3px", marginLeft: 0 }}>
          <Text block variant="large" style={{ fontWeight: 600 }}>
            {siteProduct}
          </Text>
        </HeaderLink>
        <div className="break" />
        <HeaderLink to="/catalog">Data Catalog</HeaderLink>
        <HeaderLink to="/api">API</HeaderLink>
        <HeaderLink external to="/compute">
          Hub
        </HeaderLink>
        <HeaderLink to="/apps">Applications</HeaderLink>
        <HeaderLink to="/docs">Documentation</HeaderLink>
        <HeaderLink
          asButton
          to="/account/request"
          // style={{ marginLeft: "auto", marginTop: "inherit" }}
        >
          Request access
        </HeaderLink>
      </Stack>
    </div>
    <div id="cookie-banner"></div>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
  siteProduct: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: "",
  siteProduct: "",
};

export default Header;
