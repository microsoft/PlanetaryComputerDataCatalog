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
        // minHeight: "300px",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          padding: "0 10%",
        }}
      >
        <Text block styles={{ root: { fontWeight: 500, marginTop: 5 } }}>
          Datasets
        </Text>
        <h1 style={{ marginTop: 5 }}>{collection.title}</h1>
        <Keywords keywords={collection.keywords} />
      </div>
      <div>
        <AssetThumbnail
          style={{
            maxHeight: "250px",
            objectFit: "contain",
            margin: "0 15px",
          }}
          assets={collection.assets}
        />
      </div>
    </div>
  );
};

export default Banner;
