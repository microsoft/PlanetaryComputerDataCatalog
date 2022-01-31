import {
  FontSizes,
  getTheme,
  IButtonStyles,
  IconButton,
  IStackTokens,
  Stack,
} from "@fluentui/react";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { removePinnedLayer } from "pages/Explore/state/mosaicSlice";
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

  const handleUnpin = () => {
    const layerId = layer.layerId;
    layerId && dispatch(removePinnedLayer(layerId));
  };

  const expandedIcon = isExpanded ? "ChevronDown" : "ChevronUp";
  const handleExpandClick = () => onExpandedChange(!isExpanded);
  const showOptionsIcon = showOptions ? "ColumnOptions" : "Settings";
  const handleShowOptionsClick = () => onShowOptionsChange(!showOptions);

  return (
    <Stack horizontal horizontalAlign="center" tokens={stackTokens}>
      <IconButton
        iconProps={{ iconName: showOptionsIcon }}
        onClick={handleShowOptionsClick}
        styles={buttonStyles}
      />
      <IconButton
        aria-label="Unpin layer from map"
        title="Unpin layer from map"
        disabled={!layer.isPinned}
        iconProps={{ iconName: "Unpin" }}
        onClick={handleUnpin}
        styles={buttonStyles}
      />

      <IconButton
        iconProps={{ iconName: expandedIcon }}
        onClick={handleExpandClick}
        styles={buttonStyles}
      />
    </Stack>
  );
};

export default LegendCmdBar;

const theme = getTheme();
const stackTokens: IStackTokens = {
  childrenGap: theme.spacing.s1,
};
const buttonStyles: IButtonStyles = {
  root: {
    width: 18,
    height: 18,
  },
  icon: {
    color: theme.semanticColors.bodyText,
    fontSize: FontSizes.xSmall,
  },
};
