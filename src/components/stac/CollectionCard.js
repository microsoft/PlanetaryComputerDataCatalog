import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import AssetThumbnail from "./AssetThumbnail";
import Keywords from "./Keywords";

const CollectionCard = ({ collection }) => {
  const history = useHistory();
  const href = `dataset/${collection.id}`;

  return (
    <div className="api-datasource-item" key={collection.id}>
      <Link
        to={href}
        aria-label={`Navigate to ${collection.id}`}
        style={{ textDecoration: "none", color: "initial" }}
      >
        <AssetThumbnail assets={collection.assets} />

        <h3 style={{ color: "initial" }}>{collection.title}</h3>
        <p style={{ color: "initial", minHeight: 50 }}>
          {collection["msft:short_description"]}
        </p>
      </Link>
      <Keywords
        keywords={collection.keywords}
        color="#4C4C51"
        onClick={keyword => {
          history.push({ search: `tags=${keyword}` });
        }}
      />
    </div>
  );
};

export default CollectionCard;
