import React from "react";
import { Text } from "@fluentui/react";

import AssetThumbnail from "./AssetThumbnail";
import ButtonLink from "../controls/ButtonLink";

const CollectionCard = ({ collection, shortTerm }) => {
  const buttonLabel = shortTerm || collection.title;
  return (
    <div className="api-datasource-item" key={collection.id}>
      <AssetThumbnail assets={collection.assets} />
      <h3>{collection.title}</h3>
      <Text block style={{ minHeight: 75 }}>
        {collection["msft:short_description"]}
      </Text>
      <ButtonLink to={`collection/${collection.id}`} style={{ marginTop: 10 }}>
        {`Explore ${buttonLabel}`}
      </ButtonLink>
    </div>
  );
};

export default CollectionCard;
