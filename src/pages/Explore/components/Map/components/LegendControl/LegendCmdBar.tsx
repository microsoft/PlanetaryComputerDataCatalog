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
}

const LegendCmdBar = ({
  layer,
  isExpanded,
  onExpandedChange,
}: LegendCmdBarProps) => {
  const dispatch = useExploreDispatch();

  const handleUnpin = () => {
    const searchId = layer.query.searchId;
    searchId && dispatch(removePinnedLayer(searchId));
  };

  const expandedIcon = isExpanded ? "ChevronDown" : "ChevronUp";
  const handleExpandClick = () => onExpandedChange(!isExpanded);
  return (
    <Stack horizontal horizontalAlign="center" tokens={stackTokens}>
      <IconButton
        aria-label="Unpin layer from map"
        title="Unpin layer from map"
        disabled={!layer.isPinned}
        iconProps={{ iconName: "pin" }}
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
