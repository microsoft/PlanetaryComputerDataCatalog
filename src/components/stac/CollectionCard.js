import React from "react";
import { Text } from "@fluentui/react";
import { Link as RouterLink } from "react-router-dom";

import AssetThumbnail from "./AssetThumbnail";

const CollectionCard = ({ collection }) => {
  return (
    <div
      className="api-datasource-item"
      // style={{
      //   flex: "0 48%",
      //   marginBottom: "10%",
      // }}
      key={collection.id}
    >
      <RouterLink
        style={{
          display: "inline-block",
          marginTop: "5px",
          textDecoration: "none",
        }}
        to={`collection/${collection.id}`}
      >
        <AssetThumbnail assets={collection.assets} />
        <h3>{collection.title}</h3>
        <Text block>{collection["msft:short_description"]}</Text>
      </RouterLink>
    </div>
  );
};

export default CollectionCard;
