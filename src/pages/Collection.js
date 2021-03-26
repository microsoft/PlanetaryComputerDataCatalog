import React, { useEffect, useState } from "react";
import { Redirect, useHistory, useLocation, useParams } from "react-router-dom";
import { Pivot, PivotItem } from "@fluentui/react";

import SEO from "../components/Seo";
import Layout from "../components/Layout";
import MetadataHtmlContent from "../components/MetadataHtmlContent";
import Banner from "../components/stac/Banner";
import Description from "../components/stac/Description";
import CollectionDetail from "../components/stac/CollectionDetail";
import ItemAssets from "../components/stac/ItemAssets";
import Bands from "../components/stac/Bands";

import { useCollections } from "../utils/requests";
import { collections as tabConfig } from "../config/datasets.yml";

const Collection = () => {
  const { id } = useParams();
  const location = useLocation();
  const history = useHistory();

  const [collection, setCollection] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { isSuccess, data: collections } = useCollections();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setActiveTab(location.hash.replace("#", ""));
  }, [location]);

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

  const handleTabChange = pivotItem => {
    const { itemKey } = pivotItem.props;
    history.replace({ hash: itemKey });
  };
  const tabs = tabConfig[id]?.tabs.map(({ title, src, launch }) => {
    return (
      <PivotItem
        key={title}
        headerText={title}
        itemKey={title.replace(/ /g, "-")}
      >
        <MetadataHtmlContent src={src} title={title} launch={launch} />
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
        <Pivot selectedKey={activeTab} onLinkClick={handleTabChange}>
          <PivotItem headerText="Overview" itemKey="overview">
            <div className="column-list">
              <div className="cl-item">
                <Description collection={collection} />
                <Bands collection={collection} />
                <ItemAssets itemAssets={collection.item_assets} />
              </div>
              <CollectionDetail collection={collection} />
            </div>
          </PivotItem>
          {tabs}
        </Pivot>
      ) : (
        <span>Loading...</span>
      )}
    </Layout>
  );
};

export default Collection;
