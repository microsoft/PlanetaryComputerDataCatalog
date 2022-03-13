import {
  FontSizes,
  getTheme,
  IButtonStyles,
  IconButton,
  IStackTokens,
  mergeStyleSets,
  Stack,
} from "@fluentui/react";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import {
  pinCurrentMosaic,
  removeLayerById,
  setLayerVisible,
} from "pages/Explore/state/mosaicSlice";
import { ILayerState } from "pages/Explore/types";
import { OpacityCmdButton } from "./LayerOptions";

interface LegendCmdBarProps {
  layer: ILayerState;
  isExpanded: boolean;
  onExpandedChange: (value: boolean) => void;
}

const LegendCmdBar = ({
  layer,
  isExpanded,
  onExpandedChange,
}: LegendCmdBarProps) => {
  const dispatch = useExploreDispatch();

  const handlePin = () => {
    const layerId = layer.layerId;
    const isPinned = layer.isPinned;
    isPinned ? dispatch(removeLayerById(layerId)) : dispatch(pinCurrentMosaic());
  };

  const handleVisible = () => {
    dispatch(setLayerVisible({ id: layer.layerId, value: !layer.layer.visible }));
  };

  const expand = settings.expand[isExpanded ? "true" : "false"];
  const pin = settings.pin[layer.isPinned ? "true" : "false"];
  const view = settings.view[layer.layer.visible ? "true" : "false"];

  const handleExpand = () => onExpandedChange(!isExpanded);

  return (
    <Stack horizontal horizontalAlign="center" tokens={stackTokens}>
      <IconButton
        aria-label={view.title}
        title={view.title}
        iconProps={{ iconName: view.icon }}
        onClick={handleVisible}
        styles={cmdButtonStyles}
      />
      <OpacityCmdButton layer={layer} />
      <IconButton
        aria-label={pin.title}
        title={pin.title}
        iconProps={{ iconName: pin.icon }}
        onClick={handlePin}
        styles={cmdButtonStyles}
      />
      <IconButton
        aria-label={expand.title}
        title={expand.title}
        iconProps={{ iconName: expand.icon }}
        onClick={handleExpand}
        styles={cmdButtonStyles}
      />
    </Stack>
  );
};

export default LegendCmdBar;

const settings = {
  expand: {
    true: { icon: "ChevronDown", title: "Collapse legend" },
    false: { icon: "ChevronUp", title: "Expand legend" },
  },
  pin: {
    true: { icon: "Unpin", title: "Unpin layer and remove from map" },
    false: { icon: "Pinned", title: "Pin layer to map and perform new search" },
  },
  view: {
    true: { icon: "FluentView", title: "Hide layer from map" },
    false: { icon: "FluentUnview", title: "Show layer on map" },
  },
};

const theme = getTheme();
const stackTokens: IStackTokens = {
  childrenGap: 2,
};
export const cmdButtonStyles: IButtonStyles = {
  root: {
    width: 18,
    height: 18,
  },
  icon: {
    color: theme.palette.neutralSecondaryAlt,
    fontSize: FontSizes.small,
    width: 16,
  },
};

export const activeCmdButtonStyles = mergeStyleSets(cmdButtonStyles, {
  icon: { path: { fill: theme.palette.themePrimary } },
});
