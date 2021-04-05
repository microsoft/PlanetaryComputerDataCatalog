import React from "react";
import { Link } from "react-router-dom";

import AssetThumbnail from "./AssetThumbnail";
import ButtonLink from "../controls/ButtonLink";

const CollectionCard = ({ collection, shortTerm }) => {
  const buttonLabel = shortTerm || collection.title;
  const href = `collection/${collection.id}`;
  return (
    <div className="api-datasource-item" key={collection.id}>
      <Link
        to={href}
        aria-label={`Navigate to ${collection.id}`}
        style={{ textDecoration: "none", color: "initial" }}
      >
        <AssetThumbnail assets={collection.assets} />

        <h3 style={{ color: "initial" }}>{collection.title}</h3>
        <p style={{ minHeight: 50 }}>{collection["msft:short_description"]}</p>
      </Link>
      <ButtonLink to={href} style={{ marginTop: 10 }}>
        {`Explore ${buttonLabel}`}
      </ButtonLink>
    </div>
  );
};

export default CollectionCard;
