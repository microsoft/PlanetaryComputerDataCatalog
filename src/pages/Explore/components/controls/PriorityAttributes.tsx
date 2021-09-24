import { Stack, StackItem, useTheme } from "@fluentui/react";
import * as dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { isNumber } from "lodash-es";

import { IStacItem } from "types/stac";
import IconValue from "./IconValue";

dayjs.extend(utc);
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
      {dt && (
        <span title="Acquisition date">{dayjs.utc(dt).format("MM/DD/YYYY")}</span>
      )}
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
