import { Stack, StackItem, useTheme } from "@fluentui/react";
import { isNumber } from "lodash-es";

import { toUtcDateString } from "utils";
import { IStacItem } from "types/stac";
import IconValue from "./IconValue";

interface PriorityAttributesProps {
  item: IStacItem;
}

// Show high-priority attributes if they exist
const PriorityAttributes = ({ item }: PriorityAttributesProps) => {
  const theme = useTheme();
  const cloud = item.properties?.["eo:cloud_cover"];

  // Items typically have a datetime, if not, they'll have start_/end_datetime
  const date = item.properties?.datetime;
  const dateRange = [
    item.properties?.start_datetime,
    item.properties?.end_datetime,
  ].filter(Boolean);
  const hasRange = dateRange.length > 0;

  const dtRangeTitle = hasRange && (
    <span title="Acquired between">
      {toUtcDateString(dateRange[0])} — {toUtcDateString(dateRange[1])}
    </span>
  );

  const dtTitle = !hasRange && date && (
    <span title="Acquisition date">{toUtcDateString(date)}</span>
  );

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
      {dtTitle}
      {dtRangeTitle}
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
