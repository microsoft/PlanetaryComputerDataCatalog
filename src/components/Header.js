import * as React from "react";
import PropTypes from "prop-types";
import { Stack, Text } from "@fluentui/react";
import HeaderLink from "./controls/HeaderLink";

const Header = ({ siteProduct }) => (
  <header
    style={{
      background: "#fff",
      marginBottom: "0.4rem",
    }}
  >
    <div
      style={{
        maxWidth: 1200,
        padding: "0 10%",
      }}
    >
      <Stack horizontal wrap tokens={{ childrenGap: "10px" }}>
        <a
          id="uhfLogo"
          itemProp="url"
          href="https://www.microsoft.com"
          aria-label="Microsoft"
          style={{
            padding: "16px 0 16px 10px",
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
        <HeaderLink to="/" style={{ marginTop: "-4px", marginLeft: 0 }}>
          <Text block variant="large" style={{ fontWeight: 600 }}>
            {siteProduct}
          </Text>
        </HeaderLink>
        <HeaderLink to="/catalog">Data Catalog</HeaderLink>
        <HeaderLink to="/docs">API</HeaderLink>
        <HeaderLink to="/apps">Applications</HeaderLink>
        <HeaderLink external to="/compute">
          Hub
        </HeaderLink>
        <HeaderLink to="/account/request">Request access</HeaderLink>
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
