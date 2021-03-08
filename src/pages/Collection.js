import React from "react";
import { useParams } from "react-router-dom";
import { Text } from "@fluentui/react";
import { useQuery } from "react-query";

import { getCollectionMetadata, getCollections } from "../utils/requests";
import SEO from "../components/Seo";

const Collection = () => {
  let { id } = useParams();

  const { isSuccess, data: collections } = useQuery("stac", getCollections);
  const collection = isSuccess ? collections.find((c) => c.id === id) : null;
  const metadataQuery = useQuery([id], getCollectionMetadata);

  const tags = metadataQuery.isSuccess ? (
    <div style={{ paddingBottom: 5, fontWeight: "bold" }}>
      Tags: {metadataQuery.data.tags.join(", ")}
    </div>
  ) : (
    <span>loading tags...</span>
  );

  return (
    <>
      <SEO title={id} description={collection?.description} />
      {isSuccess ? (
        <>
          <h1>{collection.title}</h1>
          {tags}
          <Text>{collection.description}</Text>
        </>
      ) : (
        <span>Loading...</span>
      )}
    </>
  );
};

export default Collection;
