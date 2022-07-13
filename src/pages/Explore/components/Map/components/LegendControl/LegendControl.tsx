import {
  IStackStyles,
  Stack,
  getTheme,
  IStackTokens,
  IconButton,
  IButtonStyles,
  IIconProps,
} from "@fluentui/react";
import { useLocalStorage } from "react-use";

import { useExploreSelector } from "pages/Explore/state/hooks";
import { controlStyle } from "../PanelControl";
import Legend from "./Legend";

export const LegendControl = () => {
  const [isOpen, setIsOpen] = useLocalStorage("legend-control-open", true);
  const { layers, layerOrder } = useExploreSelector(s => s.mosaic);

  // Generate legends for each layer, in order
  const legends = layerOrder
    .map(id => id && <Legend key={`legend-${id}`} layer={layers[id]} />)
    .filter(Boolean);

  // Keep the panel rendered even if it's closed to preserve the state of any command options
  const openStyle = { display: isOpen ? "block" : "none" };
  const legendPanel = (
    <Stack
      styles={panelStyles}
      style={openStyle}
      tokens={stackTokens}
      data-cy={"explore-legend"}
    >
      {legends}
    </Stack>
  );

  const legendTitle = isOpen ? "Hide Legend" : "Open Legend";
  const legendButton = (
    <div style={buttonStyle} title={legendTitle}>
      <div>
        <IconButton
          ariaLabel="Open legend"
          className="azure-maps-control-button"
          styles={legendButtonStyles}
          iconProps={iconProps}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
    </div>
  );

  const hasLegends = legends.length > 0;
  return hasLegends ? (
    <div className="explorer-map-component">
      {legendPanel}
      {legendButton}
    </div>
  ) : null;
};

const theme = getTheme();
const stackTokens: IStackTokens = {
  childrenGap: 2,
};
const panelStyles: IStackStyles = {
  root: {
    background: theme.semanticColors.bodyBackground,
    padding: "10px 0px 10px 0px",
    borderRadius: 2,
    position: "absolute",
    zIndex: 1,
    bottom: 75,
    right: 10,
    boxShadow: "rgb(0 0 0 / 16%) 0 0 4px",
    width: 370,
  },
};

const legendButtonStyles: IButtonStyles = {
  icon: {
    color: theme.semanticColors.bodyText,

    width: 18,
    height: 18,
  },
};

const buttonStyle = { right: 2, bottom: 32, ...controlStyle };
const iconProps: IIconProps = {
  iconName: "Layer",
  styles: {
    root: {
      fill: "rgb(131, 136, 141)",
      width: 20,
    },
  },
};
