import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { Pivot, PivotItem, Stack } from "@fluentui/react";

import { useCollections } from "../utils/requests";
import SEO from "../components/Seo";
import Notebook from "../components/Notebook";
import Keywords from "../components/stac/Keywords";
import CollectionDetail from "../components/stac/CollectionDetail";
import ItemAssets from "../components/stac/ItemAssets";

import { datasets } from "../config/site.yml";
import SpatialExtent from "../components/stac/SpatialExtent";

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

  const stackItemStyles = {
    root: {
      display: "flex",
      height: 50,
      justifyContent: "center",
    },
  };
  return (
    <>
      <SEO title={id} description={collection?.description} />
      {collection ? (
        <>
          <h1>{collection.title}</h1>
          <Keywords keywords={collection.keywords} />
          <Pivot>
            <PivotItem headerText="Details">
              <Stack
                horizontal
                tokens={{
                  childrenGap: 5,
                  padding: 10,
                }}
              >
                <Stack.Item grow={3}>
                  <CollectionDetail
                    collection={collection}
                    styles={stackItemStyles}
                  />
                </Stack.Item>
                <Stack.Item grow={2} styles={stackItemStyles}>
                  <SpatialExtent extent={collection.extent?.spatial} />
                </Stack.Item>
              </Stack>
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
