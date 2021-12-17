import {
  FontWeights,
  IStackStyles,
  ITextStyles,
  Stack,
  Text,
  getTheme,
  IStackTokens,
  StackItem,
} from "@fluentui/react";
import * as qs from "query-string";

import { ILegendConfig } from "pages/Explore/types";
import { LegendTypes } from "pages/Explore/enums";
import { useExploreSelector } from "pages/Explore/state/hooks";
import ColorMap from "./ColorMap";
import ClassMap from "./ClassMap";

export const LegendControl = () => {
  const renderOpts = useExploreSelector(s => s.mosaic.renderOption);
  const title = useExploreSelector(s => s.mosaic.collection?.title);

  if (!renderOpts) return null;

  const renderConfig = qs.parse(renderOpts.options || "");
  const legendConfig = renderOpts.legend;
  const legend = getLegendType(renderConfig, legendConfig);

  // If the legend was configured or determined to not be needed, don't render it
  if (!legend) return null;

  return (
    <Stack styles={panelStyles} tokens={stackTokens}>
      <StackItem>
        <Text block styles={headerStyles}>
          {title}
        </Text>
        <Text block>{renderOpts.name}</Text>
      </StackItem>
      <StackItem>{legend}</StackItem>
    </Stack>
  );
};

const getLegendType = (
  params: qs.ParsedQuery<string>,
  legendConfig: ILegendConfig | undefined
) => {
  // Legend configs are optional, but if they exist, use them to set the values
  if (legendConfig) {
    switch (legendConfig.type) {
      case LegendTypes.classmap:
        return <ClassMap params={params} />;
      case LegendTypes.continuous:
        return <ColorMap params={params} />;
      case LegendTypes.none:
        return null;
    }
  }

  if ("rescale" in params) {
    return <ColorMap params={params} />;
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
    borderRadius: 4,
    position: "absolute",
    zIndex: 1,
    bottom: 40,
    right: 10,
  },
};

const headerStyles: ITextStyles = {
  root: {
    fontWeight: FontWeights.semibold,
  },
};
