import React, { useState } from "react";
import {
  FontSizes,
  FontWeights,
  getTheme,
  Icon,
  IStackStyles,
  IStackTokens,
  ITextStyles,
  Separator,
  Stack,
  Text,
} from "@fluentui/react";
import * as qs from "query-string";

import { ILayerState, ILegendConfig } from "pages/Explore/types";
import { LegendTypes } from "pages/Explore/enums";
import ColorMap from "./legendTypes/ColorMap";
import ClassMap from "./legendTypes/ClassMap";
import { hasClassmapValues } from "./helpers";
import { IStacCollection } from "types/stac";

import LegendCmdBar from "./LegendCmdBar";
import { useExploreSelector } from "pages/Explore/state/hooks";
import Interval from "./legendTypes/Interval";
interface LegendProps {
  layer: ILayerState;
}

const Legend = ({ layer }: LegendProps) => {
  const { zoom } = useExploreSelector(s => s.map);
  const [isExpanded, setIsExpanded] = useState(true);
  const { renderOption, collection } = layer;

  if (!renderOption) return null;

  const renderConfig = qs.parse(renderOption.options || "");
  const legendConfig = renderOption.legend;
  const isZoomVisible = zoom + 0.5 >= layer.layer.minZoom;
  const styles = isZoomVisible ? visibleStyles : nonVisibleStyles;
  const zoomMsg = isZoomVisible ? "" : "Layer not visible at this zoom level. ";

  const legend = getLegendType(renderConfig, legendConfig, collection);

  const layerSubtitle = layer.isCustomQuery ? "Custom" : layer.query.name;
  const subtitle = `${layerSubtitle} | ${renderOption.name}`;
  const renderDesc = (
    <Text block nowrap styles={styles.subHeader} title={zoomMsg || subtitle}>
      {subtitle}
    </Text>
  );

  const handleExpandChange = (value: boolean) => {
    setIsExpanded(value);
  };

  return (
    <>
      <Stack tokens={tokens}>
        <Stack>
          <Stack
            horizontal
            horizontalAlign="space-between"
            styles={legendHeaderStyles}
          >
            <Stack horizontal horizontalAlign="start" verticalAlign="start">
              <Icon iconName="GripperDotsVertical" styles={gripperStyles} />
              <Text
                block
                nowrap
                styles={styles.header}
                title={zoomMsg || collection?.title}
              >
                {collection?.title}
              </Text>
            </Stack>
            <LegendCmdBar
              layer={layer}
              isExpanded={isExpanded}
              onExpandedChange={handleExpandChange}
              isExpandDisabled={!legend}
            />
          </Stack>
          <div style={legendBodyStyles}>{renderDesc}</div>
        </Stack>
        {isExpanded && <div style={legendBodyStyles}>{legend}</div>}
      </Stack>
      <Separator className="legend-item-separator" styles={legendSeparatorStyles} />
    </>
  );
};

export default Legend;

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
      case LegendTypes.interval:
        return <Interval params={params} legendConfig={legendConfig} />;
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
  return null; //<Text variant="smallPlus">No legend for this render option.</Text>;
};

const theme = getTheme();
const tokens: IStackTokens = {
  childrenGap: 6,
};

const legendHeaderStyles: IStackStyles = {
  root: {
    paddingLeft: 2,
    paddingRight: 6,
  },
};

const legendBodyStyles: React.CSSProperties = {
  paddingLeft: 21,
  paddingRight: 25,
};

const headerStyles: ITextStyles = {
  root: {
    fontWeight: FontWeights.semibold,
    maxWidth: 240,
  },
};

const nonVisibleHeaderStyles: ITextStyles = {
  root: {
    color: theme.semanticColors.disabledBodyText,
    fontStyle: "italic",
    fontWeight: FontWeights.semibold,
    maxWidth: 240,
  },
};

const subHeaderStyles: ITextStyles = {
  root: {
    fontSize: FontSizes.smallPlus,
  },
};

const nonVisibleSubHeaderStyles: ITextStyles = {
  root: {
    fontSize: FontSizes.smallPlus,
    color: theme.semanticColors.disabledBodyText,
    fontStyle: "italic",
  },
};

const visibleStyles = {
  header: headerStyles,
  subHeader: subHeaderStyles,
};

const nonVisibleStyles = {
  header: nonVisibleHeaderStyles,
  subHeader: nonVisibleSubHeaderStyles,
};

const legendSeparatorStyles = {
  root: {
    margin: 0,
    padding: 0,
  },
};

const gripperStyles = {
  root: {
    fontSize: 18,
    marginTop: 2,
  },
};
