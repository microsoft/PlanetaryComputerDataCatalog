import { useState } from "react";
import {
  FontSizes,
  getTheme,
  IButtonStyles,
  IconButton,
  IStackTokens,
  Stack,
} from "@fluentui/react";
import Feature from "components/Feature";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import {
  pinCurrentMosaic,
  removeLayerById,
  setLayerVisible,
} from "pages/Explore/state/mosaicSlice";
import { ILayerState } from "pages/Explore/types";

interface LegendCmdBarProps {
  layer: ILayerState;
  isExpanded: boolean;
  onExpandedChange: (value: boolean) => void;
  showOptions: boolean;
  onShowOptionsChange: (value: boolean) => void;
}

const LegendCmdBar = ({
  layer,
  isExpanded,
  onExpandedChange,
  showOptions,
  onShowOptionsChange,
}: LegendCmdBarProps) => {
  const dispatch = useExploreDispatch();
  const [isVisible, setIsVisible] = useState(true);

  const handlePin = () => {
    const layerId = layer.layerId;
    const isPinned = layer.isPinned;
    isPinned ? dispatch(removeLayerById(layerId)) : dispatch(pinCurrentMosaic());
  };

  const handleVisible = () => {
    const visible = isVisible ? false : true;
    dispatch(setLayerVisible({ id: layer.layerId, value: visible }));
    setIsVisible(!isVisible);
  };

  const expand = settings.expand[isExpanded ? "true" : "false"];
  const options = settings.showOptions[showOptions ? "true" : "false"];
  const pin = settings.pin[layer.isPinned ? "true" : "false"];
  const view = settings.view[isVisible ? "true" : "false"];

  const handleExpand = () => onExpandedChange(!isExpanded);
  const handleShowOptions = () => onShowOptionsChange(!showOptions);

  return (
    <Stack horizontal horizontalAlign="center" tokens={stackTokens}>
      <IconButton
        aria-label={view.title}
        title={view.title}
        iconProps={{ iconName: view.icon }}
        onClick={handleVisible}
        styles={buttonStyles}
      />
      <IconButton
        aria-label={options.title}
        title={options.title}
        iconProps={{ iconName: options.icon }}
        onClick={handleShowOptions}
        styles={buttonStyles}
      />
      <Feature name="pin">
        <IconButton
          aria-label={pin.title}
          title={pin.title}
          iconProps={{ iconName: pin.icon }}
          onClick={handlePin}
          styles={buttonStyles}
        />
        <IconButton
          aria-label={expand.title}
          title={expand.title}
          iconProps={{ iconName: expand.icon }}
          onClick={handleExpand}
          styles={buttonStyles}
        />
      </Feature>
    </Stack>
  );
};

export default LegendCmdBar;

const settings = {
  expand: {
    true: { icon: "ChevronDown", title: "Collapse legend" },
    false: { icon: "ChevronUp", title: "Expand legend" },
  },
  showOptions: {
    true: { icon: "FluentSettingsFilled", title: "Hide layer options" },
    false: { icon: "FluentSettings", title: "Show layer options" },
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
const buttonStyles: IButtonStyles = {
  root: {
    width: 18,
    height: 18,
  },
  icon: {
    color: theme.semanticColors.bodyText,
    fontSize: FontSizes.small,
    width: 16,
  },
};
