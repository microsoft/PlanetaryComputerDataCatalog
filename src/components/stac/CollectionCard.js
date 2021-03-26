import React from "react";
import { Text } from "@fluentui/react";
import { Link as RouterLink } from "react-router-dom";

import AssetThumbnail from "./AssetThumbnail";

const CollectionCard = ({ collection }) => {
  return (
    <div className="ds-item" key={collection.id}>
      <AssetThumbnail assets={collection.assets} />
      <h3>{collection.title}</h3>
      <Text block>{collection["msft:short_description"]}</Text>
      <RouterLink
        style={{ display: "inline-block", marginTop: "5px" }}
        to={`collection/${collection.id}`}
      >
        {collection.title}
      </RouterLink>
    </div>
  );
};

export default CollectionCard;
