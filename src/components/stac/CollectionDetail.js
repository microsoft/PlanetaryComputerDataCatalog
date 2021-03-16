import React from "react";
import { Text } from "@fluentui/react";

import CollectionSummary from "./CollectionSummary";
import License from "./License";
import Providers from "./Providers";
import TemporalExtent from "./TemporalExtent";

const CollectionDetail = ({ collection }) => {
  return (
    <div style={{ marginTop: "10px" }}>
      <License collection={collection} />
      <TemporalExtent extent={collection.extent?.temporal} />
      <Text
        block
        variant="mediumPlus"
        styles={{ root: { marginTop: "5px", marginBottom: "5px" } }}
      >
        {collection.description}
      </Text>
      <Providers providers={collection.providers} />
      <CollectionSummary collection={collection} />
    </div>
  );
};

export default CollectionDetail;
