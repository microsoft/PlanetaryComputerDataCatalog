import { Stack, StackItem, useTheme } from "@fluentui/react";
import { isNumber } from "lodash-es";

import { toUtcDate } from "utils";
import { IStacItem } from "types/stac";
import IconValue from "./IconValue";

interface PriorityAttributesProps {
  item: IStacItem;
}

// Show high-priority attributes if they exist
const PriorityAttributes = ({ item }: PriorityAttributesProps) => {
  const theme = useTheme();
  const cloud = item.properties?.["eo:cloud_cover"];
  const dt = item.properties?.datetime;

  return (
    <Stack
      horizontal
      horizontalAlign={"space-between"}
      tokens={{ childrenGap: 5 }}
      styles={{
        root: {
          color: theme.palette.neutralSecondary,
        },
      }}
    >
      {dt && <span title="Acquisition date">{toUtcDate(dt)}</span>}
      <StackItem styles={{ root: { paddingRight: 8 } }}>
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
