import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { Pivot, PivotItem } from "@fluentui/react";

import { useCollections } from "../utils/requests";
import SEO from "../components/Seo";
import Notebook from "../components/Notebook";
import Keywords from "../components/stac/Keywords";
import CollectionDetail from "../components/stac/CollectionDetail";
import ItemAssets from "../components/stac/ItemAssets";

import { datasets } from "../config/site.yml";

const Collection = () => {
  let { id } = useParams();

  const [collection, setCollection] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { isSuccess, data: collections } = useCollections();

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

  const notebookTabs = datasets[id]?.notebooks.map(({ title, src }) => {
    return (
      <PivotItem key={title} headerText={title}>
        <Notebook src={src} />
      </PivotItem>
    );
  });

  if (notFound) {
    return <Redirect to={"/404"} />;
  }

  return (
    <>
      <SEO title={id} description={collection?.description} />
      {collection ? (
        <>
          <h1>{collection.title}</h1>
          <Keywords keywords={collection.keywords} />
          <Pivot>
            <PivotItem headerText="Details">
              <CollectionDetail collection={collection} />
            </PivotItem>
            {collection.item_assets && (
              <PivotItem headerText="Assets">
                <ItemAssets itemAssets={collection.item_assets} />
              </PivotItem>
            )}
            {notebookTabs}
          </Pivot>
        </>
      ) : (
        <span>Loading...</span>
      )}
    </>
  );
};

export default Collection;
