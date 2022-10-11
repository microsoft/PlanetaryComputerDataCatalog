import { getTheme, Stack, StackItem } from "@fluentui/react";
import { isNumber } from "lodash-es";
import { formatDatetimeHuman } from "pages/Explore/utils/time";

import { IStacItem } from "types/stac";
import IconValue from "./IconValue";

interface PriorityAttributesProps {
  item: IStacItem;
}

// Show high-priority attributes if they exist
const PriorityAttributes = ({ item }: PriorityAttributesProps) => {
  const cloud = item.properties?.["eo:cloud_cover"];

  // Items typically have a datetime, if not, they'll have start_/end_datetime
  const date = item.properties?.datetime as string;
  const dateRange = [
    item.properties?.start_datetime,
    item.properties?.end_datetime,
  ].filter(Boolean);
  const hasRange = dateRange.length > 0;

  const dtRangeTitle = hasRange && (
    <span title="Acquired between">
      {formatDatetimeHuman(dateRange[0], false, true)} —{" "}
      {formatDatetimeHuman(dateRange[1], false, true)}
    </span>
  );

  const dtTitle = !hasRange && date && (
    <span title="Acquisition date (UTC)">{formatDatetimeHuman(date)}</span>
  );

  return (
    <Stack
      horizontal
      horizontalAlign={"space-between"}
      tokens={{ childrenGap: 5 }}
      styles={containerStyles}
    >
      {dtTitle}
      {dtRangeTitle}
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
