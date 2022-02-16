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
  removePinnedLayer,
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

  const handlePin = () => {
    const layerId = layer.layerId;
    const isPinned = layer.isPinned;
    isPinned ? dispatch(removePinnedLayer(layerId)) : dispatch(pinCurrentMosaic());
  };

  const expand = settings.expand[isExpanded ? "true" : "false"];
  const options = settings.showOptions[showOptions ? "true" : "false"];
  const pin = settings.pin[layer.isPinned ? "true" : "false"];

  const handleExpandClick = () => onExpandedChange(!isExpanded);
  const handleShowOptionsClick = () => onShowOptionsChange(!showOptions);

  return (
    <Stack horizontal horizontalAlign="center" tokens={stackTokens}>
      <IconButton
        aria-label={options.title}
        title={options.title}
        iconProps={{ iconName: options.icon }}
        onClick={handleShowOptionsClick}
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
          onClick={handleExpandClick}
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
    true: { icon: "ColumnOptions", title: "Hide layer options" },
    false: { icon: "Settings", title: "Show layer options" },
  },
  pin: {
    true: { icon: "Unpin", title: "Unpin layer and remove from map" },
    false: { icon: "Pinned", title: "Pin layer to map and perform new search" },
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
  },
};
