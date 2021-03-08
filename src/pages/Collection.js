import React from "react";
import { useParams } from "react-router-dom";
import { Text } from "@fluentui/react";
import { useQuery } from "react-query";

import {
  getCollectionMetadata,
  getCollections,
  getCollectionsByUrl,
} from "../utils/requests";
import SEO from "../components/Seo";

const Collection = () => {
  let { id } = useParams();

  const { data: collections } = useQuery("stac", getCollections);

  const url = collections?.links.find(
    (l) => l.rel === "child" && l.href.endsWith(`collections/${id}`)
  ).href;

  const query = useQuery([url], getCollectionsByUrl, {
    enabled: !!url,
  });

  const metadataQ = useQuery([id], getCollectionMetadata);

  const tags = metadataQ.isSuccess ? (
    <div style={{ paddingBottom: 5, fontWeight: "bold" }}>
      Tags: {metadataQ.data.tags.join(", ")}
    </div>
  ) : (
    <span>loading tags...</span>
  );

  return (
    <>
      <SEO title={id} />
      {query.isSuccess ? (
        <>
          <h1>{query.data.title}</h1>
          {tags}
          <Text>{query.data.description}</Text>
        </>
      ) : (
        <span>loading...</span>
      )}
    </>
  );
};

export default Collection;
