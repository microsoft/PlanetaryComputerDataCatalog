import React from "react";
import { Text } from "@fluentui/react";

import Keywords from "./Keywords";
import AssetThumbnail from "./AssetThumbnail";

const Banner = ({ collection }) => {
  if (!collection) return null;

  return (
    <div
      className="column-list"
      style={{
        background: "#F0F0F0",
        minHeight: "300px",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Text block>Datasets</Text>
        <h1>{collection.title}</h1>
        <Keywords keywords={collection.keywords} />
      </div>
      <div>
        <AssetThumbnail
          style={{ maxHeight: "250px", objectFit: "contain" }}
          assets={collection.assets}
        />
      </div>
    </div>
  );
};

export default Banner;
