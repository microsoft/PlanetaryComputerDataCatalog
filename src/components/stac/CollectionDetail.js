import React, { Suspense } from "react";
import { Stack } from "@fluentui/react";

import Summaries from "./Summaries";
import TemporalExtent from "./TemporalExtent";
import { useStac } from "./CollectionContext";
import Crs from "./Crs";

const SpatialExtent = React.lazy(() => import("./SpatialExtent"));

const CollectionDetail = () => {
  const collection = useStac();

  return (
    <div>
      <Stack tokens={{ childrenGap: "10px" }}>
        {/* Specify the h/w for the map, since it is lazy loaded. This
        prevents a reflow render when it does show up */}
        <div style={{ height: 175, width: 250 }}>
          <Suspense fallback={<div />}>
            <SpatialExtent extent={collection.extent?.spatial} />
          </Suspense>
        </div>
        <TemporalExtent extent={collection.extent?.temporal} />
        <Summaries collection={collection} />
        <Crs />
      </Stack>
    </div>
  );
};

export default CollectionDetail;
