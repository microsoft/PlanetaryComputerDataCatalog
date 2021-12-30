import { Stack, Text, useTheme } from "@fluentui/react";
import HeaderLink from "./components/HeaderLink";

import siteConfig from "config/site.yml";
import {
  headerStyleFactory,
  innerHeaderStyle,
  logoLinkStyle,
  logoImageStyle,
  headerPipeStyle,
  productNameStyle,
  breakStyle,
  rightAligned,
} from "./styles";
import { gridContentStyle, offGridContentStyle } from "styles";

const Header = ({ onGrid = true }) => {
  const theme = useTheme();
  const navClass = onGrid ? gridContentStyle : offGridContentStyle;

  return (
    <header className={headerStyleFactory(theme)}>
      <nav className={navClass} aria-label="Main header navigation links">
        <Stack
          className={innerHeaderStyle}
          horizontal
          wrap
          verticalAlign="center"
          tokens={{ childrenGap: "10px 21px" }}
        >
          <a
            className={logoLinkStyle}
            itemProp="url"
            href="https://www.microsoft.com"
            aria-label="Microsoft"
          >
            <img
              alt=""
              className={logoImageStyle}
              itemProp="logo"
              src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31"
              role="presentation"
              aria-hidden="true"
            />
          </a>
          <div className={headerPipeStyle}>|</div>
          <HeaderLink to="/">
            <Text block variant="large" className={productNameStyle}>
              {siteConfig.product}
            </Text>
          </HeaderLink>
          <div className={breakStyle} />
          <HeaderLink to="/explore">Explore</HeaderLink>
          <HeaderLink to="/catalog">Data Catalog</HeaderLink>
          <HeaderLink external to="/compute">
            Hub
          </HeaderLink>
          <HeaderLink to="/applications">Applications</HeaderLink>
          <HeaderLink to="/docs">Documentation</HeaderLink>
          <div className={rightAligned}>
            <HeaderLink asButton to="/account/request">
              Request access
            </HeaderLink>
          </div>
        </Stack>
      </nav>
    </header>
  );
};

export default Header;
