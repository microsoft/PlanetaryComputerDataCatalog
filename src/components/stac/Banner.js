import React from "react";
import { Text } from "@fluentui/react";

import Keywords from "./Keywords";
import { collections as collectionsConfig } from "../../config/datasets.yml";

const Banner = ({ collection }) => {
  if (!collection) return null;
  const imgUrl =
    collectionsConfig[collection.id].headerImg ||
    collection.assets?.thumbnail?.href;

  return (
    <div
      className="page-header"
      style={{
        backgroundImage: `url(${imgUrl})`,
      }}
    >
      <div
        style={{
          padding: "0 10%",
        }}
      >
        <Text
          block
          styles={{ root: { color: "#fff", fontWeight: 500, marginTop: 5 } }}
        >
          Datasets
        </Text>
        <h1 style={{ color: "#fff" }}>{collection.title}</h1>
        <Keywords keywords={collection.keywords} />
      </div>
      <div></div>
    </div>
  );
};

export default Banner;
