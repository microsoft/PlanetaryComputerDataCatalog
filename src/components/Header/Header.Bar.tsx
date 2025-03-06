import HeaderLink from "./components/HeaderLink";
import {
  headerPipeStyle,
  innerHeaderStyle,
  logoImageStyle,
  logoLinkStyle,
  productNameStyle,
} from "./styles";
import { Link, Stack, Text } from "@fluentui/react";
import { skipContentStyle } from "components/Header/styles";

export const HeaderBar: React.FC = () => {
  return (
    <Stack
      className={innerHeaderStyle}
      horizontal
      wrap
      verticalAlign="center"
      tokens={headerTokens}
    >
      <Link
        className={skipContentStyle}
        onClick={() => {
          const urlWithoutHash = window.location.href.split("#")[0];
          window.location.href = urlWithoutHash + "#generated-docs-content";
        }}
      >
        Skip to content
      </Link>
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
      <HeaderLink isNav to="/applications">
        Applications
      </HeaderLink>
      <HeaderLink isNav to="/docs">
        Documentation
      </HeaderLink>
    </Stack>
  );
};

const headerTokens = { childrenGap: "10px 21px" };
