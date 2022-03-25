import {
  Icon,
  IIconStyles,
  ITooltipHostStyles,
  Text,
  TooltipHost,
} from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { ILayerState } from "pages/Explore/types";

interface Props {
  layer: ILayerState;
}

const LayerZoomWarning = ({ layer }: Props) => {
  const tooltipId = useId("tooltip");
  const { zoom } = useExploreSelector(s => s.map);

  const msg = <Text>Layer not visible at this zoom level</Text>;

  const zoomWarning = (
    <TooltipHost
      content={msg}
      id={tooltipId}
      styles={tipStyles}
      calloutProps={{ gapSpace: 2 }}
    >
      <Icon
        iconName="FluentWarning"
        styles={iconStyles}
        aria-describedby={tooltipId}
      />
    </TooltipHost>
  );

  const isVisible = zoom + 0.5 >= layer.layer.minZoom;
  return isVisible ? (
    <Icon iconName="GripperDotsVertical" styles={gripperStyles} />
  ) : (
    zoomWarning
  );
};

export default LayerZoomWarning;

const tipStyles: ITooltipHostStyles = {
  root: {
    display: "inline-block",
    marginTop: 2,
  },
};

const iconStyles: IIconStyles = {
  root: {
    paddingRight: 2,
  },
};

const gripperStyles = {
  root: {
    fontSize: 18,
    marginTop: 2,
  },
};
