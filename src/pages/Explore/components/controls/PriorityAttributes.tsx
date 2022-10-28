import { getTheme, Stack, StackItem } from "@fluentui/react";
import { isNumber } from "lodash-es";

import { IStacItem } from "types/stac";
import IconValue from "./IconValue";
import { ItemTime } from "./ItemTime";

interface PriorityAttributesProps {
  item: IStacItem;
}

// Show high-priority attributes if they exist
const PriorityAttributes = ({ item }: PriorityAttributesProps) => {
  const cloud = item.properties?.["eo:cloud_cover"];

  return (
    <Stack
      horizontal
      horizontalAlign={"space-between"}
      tokens={{ childrenGap: 5 }}
      styles={containerStyles}
    >
      <ItemTime item={item} />
      <StackItem styles={cloudContainerStyles}>
        {isNumber(cloud) && (
          <IconValue
            iconName="Cloud"
            value={`${cloud.toFixed(1)}%`}
            title="Cloud Cover %"
          />
        )}
      </StackItem>
    </Stack>
  );
};

export default PriorityAttributes;

const theme = getTheme();
const containerStyles = {
  root: {
    color: theme.palette.neutralSecondary,
  },
};

const cloudContainerStyles = {
  root: {
    paddingRight: 8,
    fontSize: "inherit",
  },
};
