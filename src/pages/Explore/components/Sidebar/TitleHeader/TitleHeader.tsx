import {
  FontSizes,
  FontWeights,
  IStackStyles,
  IStackTokens,
  ITextStyles,
  IVerticalDividerStyles,
  Stack,
  Text,
  VerticalDivider,
} from "@fluentui/react";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";

import AdvancedModeButton from "./AdvancedModeButton";
import ResetSelectors from "./ResetSelectors";
import StartChatButton from "./StartChatButton";

export const TitleHeader = () => {
  const { collection } = useExploreSelector(selectCurrentMosaic);
  const commandBar = (
    <Stack
      horizontal
      horizontalAlign="end"
      tokens={stackTokens}
      styles={commandBarStyles}
    >
      <AdvancedModeButton />
      <VerticalDivider styles={dividerStyles} />
      <ResetSelectors />
      <VerticalDivider styles={dividerStyles} />
      <StartChatButton />
    </Stack>
  );
  return (
    <Stack horizontal styles={stackStyles}>
      <Text styles={sidebarTitleStyles} block>
        Explore datasets
      </Text>
      {collection && commandBar}
      {!collection && <StartChatButton />}
    </Stack>
  );
};

const stackTokens: IStackTokens = {
  childrenGap: 5,
};
const stackStyles: Partial<IStackStyles> = {
  root: {
    justifyContent: "space-between",
  },
};
const dividerStyles: Partial<IVerticalDividerStyles> = {
  wrapper: {
    height: 15,
    marginTop: 9,
    marginLeft: 0,
  },
};
const sidebarTitleStyles: Partial<ITextStyles> = {
  root: {
    padding: "5px 0",
    fontSize: FontSizes.mediumPlus,
    fontWeight: FontWeights.bold,
  },
};
const commandBarStyles: Partial<IStackStyles> = {
  root: {
    marginRight: 2,
  },
};
