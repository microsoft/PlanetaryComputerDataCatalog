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
import { hasClassmapValues } from "./helpers";
import { IStacCollection } from "types/stac";

export const LegendControl = () => {
  const renderOpts = useExploreSelector(s => s.mosaic.renderOption);
  const collection = useExploreSelector(s => s.mosaic.collection);

  if (!renderOpts) return null;

  const renderConfig = qs.parse(renderOpts.options || "");
  const legendConfig = renderOpts.legend;
  const legend = getLegendType(renderConfig, legendConfig, collection);
  const renderDesc =
    renderOpts.name && renderOpts?.name !== "Default" ? (
      <Text block>{renderOpts.name}</Text>
    ) : null;

  // If the legend was configured or determined to not be needed, don't render it
  if (!legend) return null;

  return (
    <Stack styles={panelStyles} tokens={stackTokens}>
      <StackItem>
        <Text block styles={headerStyles}>
          {collection?.title}
        </Text>
        {renderDesc}
      </StackItem>
      {legend}
    </Stack>
  );
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
        return <ColorMap params={params} />;
      case LegendTypes.none:
        return null;
    }
  }

  if ("rescale" in params) {
    return <ColorMap params={params} />;
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
