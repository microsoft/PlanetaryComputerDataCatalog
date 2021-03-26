import React from "react";

import Summaries from "./Summaries";
import License from "./License";
import Providers from "./Providers";
import TemporalExtent from "./TemporalExtent";
import SpatialExtent from "./SpatialExtent";
import { Stack } from "@fluentui/react";

const CollectionDetail = ({ collection }) => {
  return (
    <div>
      <Stack tokens={{ childrenGap: "10px" }}>
        <SpatialExtent extent={collection.extent?.spatial} />
        <TemporalExtent extent={collection.extent?.temporal} />
        <License collection={collection} />
        <Providers providers={collection.providers} />
        <Summaries collection={collection} />
      </Stack>
    </div>
  );
};

export default CollectionDetail;
