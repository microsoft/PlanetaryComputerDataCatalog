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
import { setLayerVisible } from "pages/Explore/state/mosaicSlice";
import { ILayerState } from "pages/Explore/types";
import { OpacityCmdButton } from "./LayerOptions";
import LayerOverflowOptions from "./LayerOverflowOptions";

interface LegendCmdBarProps {
  layer: ILayerState;
  isExpanded: boolean;
  onExpandedChange: (value: boolean) => void;
  isExpandDisabled: boolean;
}

const LegendCmdBar = ({
  layer,
  isExpanded,
  onExpandedChange,
  isExpandDisabled = false,
}: LegendCmdBarProps) => {
  const dispatch = useExploreDispatch();

  const handleVisible = () => {
    dispatch(setLayerVisible({ id: layer.layerId, value: !layer.layer.visible }));
  };

  const expand = settings.expand[isExpanded ? "true" : "false"];
  const view = settings.view[layer.layer.visible ? "true" : "false"];
  const handleExpand = () => onExpandedChange(!isExpanded);

  const btnOpacity = <OpacityCmdButton layer={layer} />;
  const btnVisible = (
    <IconButton
      role="menuitem"
      aria-label={view.title}
      title={view.title}
      iconProps={{ iconName: view.icon }}
      onClick={handleVisible}
      styles={cmdButtonStyles}
    />
  );

  return (
    <Stack
      horizontal
      horizontalAlign="center"
      tokens={stackTokens}
      role="menubar"
      aria-orientation="horizontal"
    >
      {btnVisible}
      {btnOpacity}
      <IconButton
        aria-label={expand.title}
        title={expand.title}
        disabled={isExpandDisabled}
        iconProps={{ iconName: expand.icon }}
        onClick={handleExpand}
        styles={cmdButtonStyles}
      />
      <LayerOverflowOptions layer={layer} />
    </Stack>
  );
};

export default LegendCmdBar;

const settings = {
  expand: {
    true: { icon: "ChevronDown", title: "Collapse legend" },
    false: { icon: "ChevronUp", title: "Expand legend" },
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
    padding: 2,
  },
  rootHasMenu: {
    width: 18,
    height: 18,
    padding: 2,
  },
  icon: {
    color: theme.palette.neutralSecondaryAlt,
    fontSize: FontSizes.small,
    width: 16,
  },
  menuIcon: {
    color: theme.palette.neutralSecondaryAlt,
    fontSize: FontSizes.small,
    width: 16,
  },
};

export const activeCmdButtonStyles = mergeStyleSets(cmdButtonStyles, {
  icon: { color: theme.palette.themePrimary },
});
