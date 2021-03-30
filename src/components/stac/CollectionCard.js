import React from "react";

import AssetThumbnail from "./AssetThumbnail";
import ButtonLink from "../controls/ButtonLink";

const CollectionCard = ({ collection, shortTerm }) => {
  const buttonLabel = shortTerm || collection.title;
  return (
    <div className="api-datasource-item" key={collection.id}>
      <AssetThumbnail assets={collection.assets} />
      <h3>{collection.title}</h3>
      <p style={{ minHeight: 75 }}>{collection["msft:short_description"]}</p>
      <ButtonLink to={`collection/${collection.id}`} style={{ marginTop: 10 }}>
        {`Explore ${buttonLabel}`}
      </ButtonLink>
    </div>
  );
};

export default CollectionCard;
