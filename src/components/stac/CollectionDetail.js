import React from "react";

import Summaries from "./Summaries";
import TemporalExtent from "./TemporalExtent";
import SpatialExtent from "./SpatialExtent";
import { Stack } from "@fluentui/react";

const CollectionDetail = ({ collection }) => {
  return (
    <div>
      <Stack tokens={{ childrenGap: "10px" }}>
        <SpatialExtent extent={collection.extent?.spatial} />
        <TemporalExtent extent={collection.extent?.temporal} />
        <Summaries collection={collection} />
      </Stack>
    </div>
  );
};

export default CollectionDetail;
