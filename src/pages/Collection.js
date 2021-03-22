import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { Pivot, PivotItem } from "@fluentui/react";

import SEO from "../components/Seo";
import Layout from "../components/Layout";
import Notebook from "../components/Notebook";
import Banner from "../components/stac/Banner";
import Description from "../components/stac/Description";
import CollectionDetail from "../components/stac/CollectionDetail";
import ItemAssets from "../components/stac/ItemAssets";
import Bands from "../components/stac/Bands";

import { useCollections } from "../utils/requests";
import { collections as notebookConfig } from "../config/datasets.yml";

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

  const notebookTabs = notebookConfig[id]?.notebooks.map(({ title, src }) => {
    return (
      <PivotItem key={title} headerText={title}>
        <Notebook src={src} />
      </PivotItem>
    );
  });

  if (notFound) {
    return <Redirect to={"/404"} />;
  }

  const bannerHeader = <Banner collection={collection} />;

  return (
    <Layout bannerHeader={bannerHeader}>
      <SEO title={id} description={collection?.description} />
      {collection ? (
        <Pivot>
          <PivotItem headerText="Overview">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "70% 30%",
                gridGap: "10px",
              }}
            >
              <Description collection={collection} />
              <CollectionDetail collection={collection} />
            </div>
            <Bands collection={collection} />
            {collection.item_assets && (
              <ItemAssets itemAssets={collection.item_assets} />
            )}
          </PivotItem>
          {notebookTabs}
        </Pivot>
      ) : (
        <span>Loading...</span>
      )}
    </Layout>
  );
};

export default Collection;
