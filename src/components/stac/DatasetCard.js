import React from "react";
import { Text } from "@fluentui/react";
import { Link as RouterLink } from "react-router-dom";

import AssetThumbnail from "./AssetThumbnail";

const CollectionCard = ({ collection }) => {
  return (
    <div className="ds-item" key={collection.id}>
      <AssetThumbnail assets={collection.assets} />
      <h3>{collection.title}</h3>
      <Text block>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Text>
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
