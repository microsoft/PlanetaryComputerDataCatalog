import HeaderLink from "./components/HeaderLink";
import {
  headerPipeStyle,
  innerHeaderStyle,
  logoImageStyle,
  logoLinkStyle,
  productNameStyle,
  rightAligned,
} from "./styles";
import { Stack, Text } from "@fluentui/react";
import { UserHeaderControl } from "components/auth/login";

export const HeaderBar: React.FC = () => {
  return (
    <Stack
      className={innerHeaderStyle}
      horizontal
      wrap
      verticalAlign="center"
      tokens={headerTokens}
    >
      <a
        className={logoLinkStyle}
        href="https://www.microsoft.com"
        aria-label="Microsoft"
      >
        <img
          alt=""
          className={logoImageStyle}
          src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31"
          role="presentation"
          aria-hidden="true"
        />
      </a>
      <div className={headerPipeStyle}>|</div>
      <HeaderLink to="/">
        <Text block variant="large" className={productNameStyle}>
          Planetary Computer
        </Text>
      </HeaderLink>
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
        <Stack horizontal verticalAlign="center" tokens={authSectionTokens}>
          <UserHeaderControl />
        </Stack>
      </div>
    </Stack>
  );
};

const headerTokens = { childrenGap: "10px 21px" };
const authSectionTokens = { childrenGap: 4 };
