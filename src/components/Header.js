import * as React from "react";
import PropTypes from "prop-types";
import { Stack, Text } from "@fluentui/react";
import Logo from "../images/Microsoft-logo_rgb_c-gray.png";
import { Link } from "react-router-dom";

const Header = ({ siteProduct, siteTitle }) => (
  <header
    style={{
      background: "#fff",
      marginBottom: "1.45rem",
    }}
  >
    <div
      style={{
        margin: "0 auto",
        maxWidth: 960,
        paddingLeft: "1.5rem",
      }}
    >
      <Stack horizontal>
        <img src={Logo} height={65} alt="Microsoft Logo" />
        <Stack.Item align="center">
          <Text block variant="xLarge">
            | {siteProduct}
          </Text>
        </Stack.Item>
      </Stack>
      <Text block variant="xLarge">
        {siteTitle}
      </Text>
      <Link to="/">Home</Link>
    </div>
    <div id="cookie-banner"></div>
    <hr />
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
