import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { Text } from "@fluentui/react";
import { useQuery } from "react-query";
import StacFields from "@radiantearth/stac-fields";

import { getCollections } from "../utils/requests";
import SEO from "../components/Seo";
import CollectionSummary from "../components/stac/CollectionSummary";
import Keywords from "../components/stac/Keywords";
import License from "../components/stac/License";
import Providers from "../components/stac/Providers";
import TemporalExtent from "../components/stac/TemporalExtent";

console.log(StacFields);
const Collection = () => {
  let { id } = useParams();

  const [collection, setCollection] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { isSuccess, data: collections } = useQuery("stac", getCollections);

  useEffect(() => {
    if (isSuccess) {
      const collection = collections.find(c => c.id === id);
      if (collection) {
        setCollection(collection);
      } else {
        setNotFound(true);
      }
    }
  }, [id, collections, isSuccess]);

  if (notFound) {
    return <Redirect to={"/404"} />;
  }

  console.log("c", collection);

  return (
    <>
      <SEO title={id} description={collection?.description} />
      {collection ? (
        <>
          <h1>{collection.title}</h1>
          <Keywords keywords={collection.keywords} />
          <License collection={collection} />
          <TemporalExtent extent={collection.extent?.temporal} />
          <Text
            block
            variant="mediumPlus"
            styles={{ root: { marginTop: "5px", marginBottom: "5px" } }}
          >
            {collection.description}
          </Text>
          <Providers providers={collection.providers} />
          <CollectionSummary collection={collection} />
        </>
      ) : (
        <span>Loading...</span>
      )}
    </>
  );
};

export default Collection;
