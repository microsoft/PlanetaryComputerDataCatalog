import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Separator } from "@fluentui/react";

import GroupBanner from "../components/stac/GroupBanner";
import Layout from "../components/Layout";
import NotFound from "./NotFound";
import SEO from "../components/Seo";
import { useCollections } from "../utils/requests";

import groups from "../config/datasetGroups.yml";
import CollectionCard from "../components/stac/CollectionCard";
import { errorMsg, loadingMsg } from "../components/stac/CollectionLoaders";

const CatalogGroup = () => {
  const { groupId } = useParams();
  const [collections, setCollections] = useState([]);

  const group = groups[groupId];

  const {
    isError,
    isLoading,
    isSuccess,
    data: stacResponse,
  } = useCollections();

  useEffect(() => {
    if (isSuccess) {
      const collections = stacResponse.collections.filter(
        c => c["msft:group_id"] === groupId
      );

      if (collections.length) {
        setCollections(collections);
      }
    }
  }, [groupId, stacResponse, isSuccess]);

  const getCollectionCards = () =>
    collections.map(c => (
      <CollectionCard key={`card-${c.id}`} collection={c} />
    ));

  const datasets = isLoading
    ? loadingMsg
    : isError
    ? errorMsg
    : getCollectionCards();

  if (!group) {
    return <NotFound />;
  }

  const banner = <GroupBanner group={group} />;

  return (
    <Layout bannerHeader={banner} isShort>
      <SEO title={group.title} description={null} />
      <section id="catalog-api-datasets">
        <div className="grid-content">
          <h2>Overview</h2>
          <p style={{ maxWidth: 800, marginBottom: 40 }}>{group.description}</p>
          <div className="layout-container">
            {<Separator />}
            <div className="layout-row">{datasets}</div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CatalogGroup;
