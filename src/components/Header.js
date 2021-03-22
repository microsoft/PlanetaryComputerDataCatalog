import * as React from "react";
import PropTypes from "prop-types";
import { Stack, Text } from "@fluentui/react";
import HeaderLink from "./controls/HeaderLink";

const Header = ({ siteProduct }) => (
  <header
    style={{
      background: "#fff",
      marginBottom: "1.45rem",
    }}
  >
    <div
      style={{
        margin: "0 auto",
        maxWidth: 1200,
        paddingLeft: "1.5rem",
      }}
    >
      <Stack horizontal tokens={{ childrenGap: "16px" }}>
        <a
          id="uhfLogo"
          itemProp="url"
          href="https://www.microsoft.com"
          aria-label="Microsoft"
          style={{
            padding: "16px 6px 16px 10px",
            float: "left",
            height: "100%",
            marginTop: "10px",
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
        <Stack.Item align="center" style={{ marginLeft: "0" }}>
          <Text block variant="xLarge">
            | {siteProduct}
          </Text>
        </Stack.Item>
        <HeaderLink to="/">Datasets</HeaderLink>
        <HeaderLink to="/docs/api">API</HeaderLink>
        <HeaderLink to="/docs/compute">Compute</HeaderLink>
        <HeaderLink to="/apps">Apps</HeaderLink>
        <HeaderLink to="/account/request">Request an Account</HeaderLink>
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
