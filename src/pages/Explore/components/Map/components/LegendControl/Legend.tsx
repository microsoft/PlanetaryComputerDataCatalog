import React from "react";
import {
  FontSizes,
  FontWeights,
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
import ColorMap from "./ColorMap";
import ClassMap from "./ClassMap";
import { hasClassmapValues } from "./helpers";
import { IStacCollection } from "types/stac";

import LegendCmdBar from "./LegendCmdBar";
import LayerOptions from "./LayerOptions";
interface LegendProps {
  layer: ILayerState;
}

const Legend = ({ layer }: LegendProps) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [showOptions, setShowOptions] = React.useState(false);
  const { renderOption, collection } = layer;

  if (!renderOption) return null;

  const renderConfig = qs.parse(renderOption.options || "");
  const legendConfig = renderOption.legend;

  const legend = getLegendType(renderConfig, legendConfig, collection);
  const layerOptions = <LayerOptions layer={layer} />;

  const layerSubtitle = layer.isCustomQuery ? "Custom" : layer.query.name;
  const renderDesc = (
    <Text block styles={subHeaderStyles}>
      {layerSubtitle} | {renderOption.name}
    </Text>
  );

  const handleExpandChange = (value: boolean) => {
    setIsExpanded(value);
  };
  const handleOptionsChange = (value: boolean) => {
    setShowOptions(value);
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
              <Text block nowrap styles={headerStyles} title={collection?.title}>
                {collection?.title}
              </Text>
            </Stack>
            <LegendCmdBar
              layer={layer}
              isExpanded={isExpanded}
              onExpandedChange={handleExpandChange}
              showOptions={showOptions}
              onShowOptionsChange={handleOptionsChange}
            />
          </Stack>
          <div style={legendBodyStyles}>{renderDesc}</div>
        </Stack>
        {showOptions && <div style={legendBodyStyles}>{layerOptions}</div>}
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
  return <Text variant="smallPlus">No legend for this render option.</Text>;
};

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
  paddingRight: 6,
};

const headerStyles: ITextStyles = {
  root: {
    fontWeight: FontWeights.semibold,
    maxWidth: 240,
  },
};

const subHeaderStyles: ITextStyles = {
  root: {
    fontSize: FontSizes.smallPlus,
  },
};

const gripperStyles = {
  root: {
    fontSize: 18,
    marginTop: 2,
  },
};

const legendSeparatorStyles = {
  root: {
    margin: 0,
    padding: 0,
  },
};
