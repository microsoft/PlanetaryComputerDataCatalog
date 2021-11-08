import {
  FontSizes,
  FontWeights,
  IStackStyles,
  IStackTokens,
  Stack,
  Text,
} from "@fluentui/react";

import CustomizeQuery from "./CustomizeQuery";
import ResetSelectors from "./ResetSelectors";

export const TitleHeader = () => {
  return (
    <Stack horizontal styles={stackStyles}>
      <Text styles={sidebarTitleStyles} block>
        Explore datasets
      </Text>
      <Stack horizontal horizontalAlign="end" tokens={stackTokens}>
        <CustomizeQuery />
        <ResetSelectors />
      </Stack>
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

const sidebarTitleStyles = {
  root: {
    padding: "5px 0",
    fontSize: FontSizes.mediumPlus,
    fontWeight: FontWeights.bold,
  },
};
