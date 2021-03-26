import React from "react";
import { Text } from "@fluentui/react";

import Keywords from "./Keywords";
import AssetThumbnail from "./AssetThumbnail";

const Banner = ({ collection }) => {
  if (!collection) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "70% 30%",
        gridGap: "10px",
        background: "#F0F0F0",
        minHeight: "300px",
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
