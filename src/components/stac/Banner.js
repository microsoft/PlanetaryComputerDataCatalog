import React from "react";
import { Text } from "@fluentui/react";

import Keywords from "./Keywords";
import { collections as collectionsConfig } from "../../config/datasets.yml";
import { useHistory } from "react-router";

const Banner = ({ collection }) => {
  const history = useHistory();
  if (!collection) return null;

  const handleClick = keyword => {
    history.push({ pathname: "/catalog", search: `tags=${keyword}` });
  };

  const imgUrl =
    collectionsConfig[collection.id]?.headerImg ||
    collection.assets?.thumbnail?.href;

  return (
    <div
      className="page-header"
      style={{
        backgroundImage: `url(${imgUrl})`,
      }}
    >
      <div className="grid-content">
        <Text
          block
          styles={{ root: { color: "#fff", fontWeight: 500, marginTop: 5 } }}
        >
          Datasets
        </Text>
        <h1 style={{ color: "#fff" }}>{collection.title}</h1>
        <Keywords keywords={collection.keywords} onClick={handleClick} />
      </div>
      <div></div>
    </div>
  );
};

export default Banner;
