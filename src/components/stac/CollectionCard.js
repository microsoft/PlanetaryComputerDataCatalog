import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import AssetThumbnail from "./AssetThumbnail";
import Keywords from "./Keywords";

const CollectionCard = ({ collection }) => {
  const navigate = useNavigate();
  const href = `/dataset/${collection.id}`;

  return (
    <div className="api-datasource-item" key={collection.id}>
      <Link to={href} aria-label={`Navigate to ${collection.id}`}>
        <AssetThumbnail assets={collection.assets} />

        <h3 style={{ marginBottom: 0 }}>{collection.title || collection.id}</h3>
      </Link>
      <p style={{ color: "initial", minHeight: 40 }}>
        {collection["msft:short_description"]}
      </p>
      <Keywords
        keywords={collection.keywords}
        color="#4C4C51"
        onClick={keyword => {
          navigate({ pathname: "/catalog", search: `filter=${keyword}` });
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
};

export default CollectionCard;
