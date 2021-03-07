import React from "react";
import { useParams } from "react-router-dom";
import { Text } from "@fluentui/react";
import { useQuery } from "react-query";

import {
  getCollectionMetadata,
  getCollections,
  getCollectionsByUrl,
} from "../utils/requests";

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

  return (
    <div>
      <h3>{id}</h3>
      {metadataQ.isSuccess ? (
        <div>Tags: {metadataQ.data.tags[0]}</div>
      ) : (
        <span>loading metadata...</span>
      )}
      {query.isSuccess ? (
        <>
          <h1>{query.data.title}</h1>
          <Text>{query.data.description}</Text>
          <hr />
        </>
      ) : (
        <span>loading...</span>
      )}
    </div>
  );
};

export default Collection;
