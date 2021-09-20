import { Stack, Text, useTheme } from "@fluentui/react";
import HeaderLink from "./controls/HeaderLink";

import { product as siteProduct } from "../config/site.yml";

const Header = ({ onGrid = true }) => {
  const theme = useTheme();
  const navClass = onGrid ? "grid-content" : "off-grid-content";

  return (
    <header
      style={{
        background: theme.semanticColors.bodyBackground,
      }}
    >
      <nav className={navClass} aria-label="Main header navigation links">
        <Stack
          className="inner-header"
          horizontal
          wrap
          style={{ margin: "1px 0" }}
          tokens={{ childrenGap: "10px" }}
        >
          <a
            id="uhfLogo"
            itemProp="url"
            href="https://www.microsoft.com"
            aria-label="Microsoft"
            style={{
              padding: "16px 6px 16px 10px",
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
              fontSize: 23.5,
              fontWeight: 500,
              marginTop: 11.5,
              marginRight: 15,
              marginLeft: 7.5,
            }}
          >
            |
          </span>
          <HeaderLink to="/" style={{ marginTop: "-1px", marginLeft: 2 }}>
            <Text block variant="large" style={{ fontWeight: 600 }}>
              {siteProduct}
            </Text>
          </HeaderLink>
          <div className="break" />
          <HeaderLink to="/explore">Explore</HeaderLink>
          <HeaderLink to="/catalog">Data Catalog</HeaderLink>
          <HeaderLink external to="/compute">
            Hub
          </HeaderLink>
          <HeaderLink to="/applications">Applications</HeaderLink>
          <HeaderLink to="/docs">Documentation</HeaderLink>
          <HeaderLink asButton to="/account/request">
            Request access
          </HeaderLink>
        </Stack>
      </nav>
    </header>
  );
};

export default Header;
