import {
  FontWeights,
  IStackStyles,
  ITextStyles,
  Stack,
  Text,
  getTheme,
  IStackTokens,
  StackItem,
  FontSizes,
  IconButton,
  IButtonStyles,
} from "@fluentui/react";
import * as qs from "query-string";
import { useLocalStorage } from "react-use";

import { ILegendConfig } from "pages/Explore/types";
import { LegendTypes } from "pages/Explore/enums";
import { useExploreSelector } from "pages/Explore/state/hooks";
import ColorMap from "./ColorMap";
import ClassMap from "./ClassMap";
import { hasClassmapValues } from "./helpers";
import { IStacCollection } from "types/stac";
import { controlStyle } from "../PanelControl";

export const LegendControl = () => {
  const renderOpts = useExploreSelector(s => s.mosaic.renderOption);
  const collection = useExploreSelector(s => s.mosaic.collection);
  const [isOpen, setIsOpen] = useLocalStorage("legend-control-open", true);

  if (!renderOpts) return null;

  const renderConfig = qs.parse(renderOpts.options || "");
  const legendConfig = renderOpts.legend;
  const legend = getLegendType(renderConfig, legendConfig, collection);
  const renderDesc =
    renderOpts.name && renderOpts?.name !== "Default" ? (
      <Text block styles={subHeaderStyles}>
        {renderOpts.name}
      </Text>
    ) : null;

  const legendPanel = (
    <Stack styles={panelStyles} tokens={stackTokens}>
      <StackItem>
        <Stack horizontal horizontalAlign="space-between">
          <Text block styles={headerStyles}>
            {collection?.title}
          </Text>
          <IconButton
            title="Hide Legend"
            iconProps={{ iconName: "ChevronDown" }}
            styles={minimizeButtonStyles}
            onClick={() => setIsOpen(!isOpen)}
          />
        </Stack>
        {renderDesc}
      </StackItem>
      {legend}
    </Stack>
  );

  const buttonStyle = { right: 2, bottom: 32, ...controlStyle };
  const legendButton = (
    <div style={buttonStyle}>
      <IconButton
        ariaLabel={legend ? "Open legend" : "No legend available"}
        title={"Open legend"}
        onClick={() => setIsOpen(true)}
        disabled={!legend}
        styles={legendButtonStyles}
        className="azure-maps-control-button"
        iconProps={{ iconName: "ThumbnailView" }}
      />
    </div>
  );

  return isOpen && legend ? legendPanel : legendButton;
};

const getLegendType = (
  params: qs.ParsedQuery<string>,
  legendConfig: ILegendConfig | undefined,
  collection: IStacCollection | null
) => {
  // Legend configs are optional, but if they exist, use them to set the values
  if (legendConfig) {
    switch (legendConfig.type) {
      case LegendTypes.classmap:
        return <ClassMap params={params} collection={collection} />;
      case LegendTypes.continuous:
        return <ColorMap params={params} legendConfig={legendConfig} />;
      case LegendTypes.none:
        return null;
      default:
        throw new Error(`Unknown legend type: ${legendConfig.type}`);
    }
  }

  if ("rescale" in params) {
    return <ColorMap params={params} legendConfig={legendConfig} />;
  }

  if (hasClassmapValues(collection, params.assets)) {
    return <ClassMap params={params} collection={collection} />;
  }
};

const theme = getTheme();
const stackTokens: IStackTokens = {
  childrenGap: theme.spacing.s1,
};
const panelStyles: IStackStyles = {
  root: {
    background: theme.semanticColors.bodyBackground,
    padding: 10,
    borderRadius: 2,
    position: "absolute",
    zIndex: 1,
    bottom: 40,
    right: 10,
    boxShadow: "rgb(0 0 0 / 16%) 0 0 4px",
    width: 300,
  },
};

const headerStyles: ITextStyles = {
  root: {
    fontWeight: FontWeights.semibold,
  },
};

const subHeaderStyles: ITextStyles = {
  root: {
    fontSize: FontSizes.smallPlus,
  },
};

const legendButtonStyles: IButtonStyles = {
  icon: { color: theme.semanticColors.bodyText },
};

const minimizeButtonStyles: IButtonStyles = {
  root: {
    width: 18,
    height: 18,
  },
  icon: {
    color: theme.semanticColors.bodyText,
    fontSize: FontSizes.xSmall,
  },
};
