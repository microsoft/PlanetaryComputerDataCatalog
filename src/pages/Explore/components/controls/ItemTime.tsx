import React from "react";

import { formatDatetimeHuman } from "pages/Explore/utils/time";
import { IStacItem } from "types/stac";

interface ItemTimeProps {
  item: IStacItem;
}

export const ItemTime: React.FC<ItemTimeProps> = ({ item }) => {
  // Items typically have a datetime, if not, they'll have start_/end_datetime
  const date = item.properties?.datetime as string;
  const dateRange = [
    item.properties?.start_datetime,
    item.properties?.end_datetime,
  ].filter(Boolean);
  const hasRange = dateRange.length > 0;

  if (hasRange) {
    return (
      <span title="Acquired between">
        {formatDatetimeHuman(dateRange[0], false, true)} —{" "}
        {formatDatetimeHuman(dateRange[1], false, true)}
      </span>
    );
  }

  return <span title="Acquisition date (UTC)">{formatDatetimeHuman(date)}</span>;
};
