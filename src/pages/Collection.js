import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { Text } from "@fluentui/react";
import { useQuery } from "react-query";

import { getCollectionMetadata, getCollections } from "../utils/requests";
import SEO from "../components/Seo";

const Collection = () => {
  let { id } = useParams();

  const [collection, setCollection] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { isSuccess, data: collections } = useQuery("stac", getCollections);

  useEffect(() => {
    if (isSuccess) {
      const collection = collections.find((c) => c.id === id);
      if (collection) {
        setCollection(collection);
      } else {
        setNotFound(true);
      }
    }
  }, [id, collections, isSuccess]);

  // Attempt to load static metadata for this collection. These are optional, so
  // don't retry failures
  const metadataQuery = useQuery([id], getCollectionMetadata, { retry: 0 });

  if (notFound) {
    return <Redirect to={"/404"} />;
  }

  const tags = metadataQuery.isSuccess ? (
    <div style={{ paddingBottom: 5, fontWeight: "bold" }}>
      Tags: {metadataQuery.data.tags.join(", ")}
    </div>
  ) : null;

  return (
    <>
      <SEO title={id} description={collection?.description} />
      {collection ? (
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
