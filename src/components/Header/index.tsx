import { Stack, Text, useTheme } from "@fluentui/react";
import HeaderLink from "./components/HeaderLink";
import { useSession } from "components/auth/hooks/SessionContext";

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
import Feature from "components/Feature";
import Login from "components/auth/Login";
import Logout from "components/auth/Logout";

const Header = ({ onGrid = true }) => {
  const theme = useTheme();
  const { status } = useSession();
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
          <HeaderLink isNav to="/explore">
            Explore
          </HeaderLink>
          <HeaderLink isNav to="/catalog">
            Data Catalog
          </HeaderLink>
          <HeaderLink external to="/compute">
            Hub
          </HeaderLink>
          <HeaderLink isNav to="/applications">
            Applications
          </HeaderLink>
          <HeaderLink isNav to="/docs">
            Documentation
          </HeaderLink>
          <div className={rightAligned}>
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
              {!status.isLoggedIn && (
                <HeaderLink asButton to="/account/request">
                  Request access
                </HeaderLink>
              )}
              <Feature name="login">
                <Login />
                <Logout />
              </Feature>
            </Stack>
          </div>
        </Stack>
      </nav>
    </header>
  );
};

export default Header;
