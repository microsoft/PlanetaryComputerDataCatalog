import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import AssetThumbnail from "./AssetThumbnail";
import Keywords from "./Keywords";

const CollectionCard = ({ collection }) => {
  const history = useHistory();
  const href = `/dataset/${collection.id}`;

  return (
    <div className="api-datasource-item" key={collection.id}>
      <Link to={href} aria-label={`Navigate to ${collection.id}`}>
        <AssetThumbnail assets={collection.assets} />

        <h3>{collection.title}</h3>
      </Link>
      <p style={{ color: "initial", minHeight: 40 }}>
        {collection["msft:short_description"]}
      </p>
      <Keywords
        keywords={collection.keywords}
        color="#4C4C51"
        onClick={keyword => {
          history.push({ pathname: "/catalog", search: `tags=${keyword}` });
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
};

export default CollectionCard;
