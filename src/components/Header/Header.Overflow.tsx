import {
  getTheme,
  IconButton,
  Panel,
  PanelType,
  Stack,
  StackItem,
  Text,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import HeaderLink from "./components/HeaderLink";
import {
  headerPipeStyle,
  logoImageStyle,
  logoLinkStyle,
  productNameStyle,
  smallHeaderStyle,
} from "./styles";

export const HeaderOverflow: React.FC = () => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);

  return (
    <Stack
      className={smallHeaderStyle}
      horizontal
      tokens={headerTokens}
      horizontalAlign="space-between"
    >
      <Stack horizontal>
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
      </Stack>
      <StackItem>
        <IconButton
          ariaLabel="Navigation overflow menu"
          iconProps={overflowIconProps}
          onClick={openPanel}
        />
        <Panel
          isLightDismiss
          isOpen={isOpen}
          onDismiss={dismissPanel}
          type={PanelType.custom}
          customWidth="200px"
        >
          <Stack tokens={panelLinkTokens} verticalAlign="start">
            <HeaderLink align="start" isNav to="/explore">
              Explore
            </HeaderLink>
            <HeaderLink align="start" isNav to="/catalog">
              Data Catalog
            </HeaderLink>
            <HeaderLink align="start" external to="/compute">
              Hub
            </HeaderLink>
            <HeaderLink align="start" isNav to="/applications">
              Applications
            </HeaderLink>
            <HeaderLink align="start" isNav to="/docs">
              Documentation
            </HeaderLink>
            <HeaderLink align="start" isNav to="/account/request">
              Request Access
            </HeaderLink>
          </Stack>
        </Panel>
      </StackItem>
    </Stack>
  );
};

const theme = getTheme();

const overflowIconProps = {
  iconName: "GlobalNavButton",
  styles: {
    root: {
      fontSize: 20,
      height: 20,
      lineHeight: 20,
      color: theme.semanticColors.bodyText,
    },
  },
};
const panelLinkTokens = { childrenGap: 15 };
const headerTokens = { childrenGap: "10px 21px" };
