import {
  IStackStyles,
  Stack,
  getTheme,
  IStackTokens,
  IconButton,
  IButtonStyles,
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

  // const legendItems =
  const legendPanel = (
    <Stack styles={panelStyles} tokens={stackTokens}>
      {legends}
    </Stack>
  );

  const legendButton = (
    <div style={buttonStyle}>
      <IconButton
        ariaLabel="Open legend"
        title={"Open legend"}
        className="azure-maps-control-button"
        styles={legendButtonStyles}
        iconProps={{ iconName: "MapLegend" }}
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );

  return (
    <>
      {isOpen && legends.length > 0 && legendPanel}
      {legendButton}
    </>
  );
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
    bottom: 40,
    right: 45,
    boxShadow: "rgb(0 0 0 / 16%) 0 0 4px",
    width: 350,
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
