import { useEffect, useState } from "react";
import { Redirect, useHistory, useLocation, useParams } from "react-router-dom";
import {
  MessageBar,
  MessageBarType,
  Pivot,
  PivotItem,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";

import Bands from "../components/stac/Bands";
import Banner from "../components/stac/Banner";
import CollectionDetail from "../components/stac/CollectionDetail";
import Description from "../components/stac/Description";
import ItemAssets from "../components/stac/ItemAssets";
import Layout from "../components/Layout";
import License from "../components/stac/License";
import MetadataHtmlContent from "../components/MetadataHtmlContent";
import Providers from "../components/stac/Providers";
import SEO from "../components/Seo";
import { CubeDimensions, CubeVariables } from "../components/stac/CubeTable";
import { TableTables, TableColumns } from "../components/stac/Table";
import { CollectionProvider } from "../components/stac/CollectionContext";
import { viewerPivot } from "components/stac/viewerPivot";

import { useCollections } from "../utils/requests";
import { collections as tabConfig } from "../config/datasets.yml";
import Assets from "../components/stac/Assets";
import CollectionUrl from "components/stac/CollectionUrl";

const Collection = () => {
  const { id } = useParams();
  const location = useLocation();
  const history = useHistory();

  const [collection, setCollection] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { isError, isLoading, isSuccess, data: stacResponse } = useCollections();

  useEffect(() => {
    setActiveTab(location.hash.replace("#", ""));
  }, [location]);

  useEffect(() => {
    if (isSuccess) {
      const collection = stacResponse.collections.find(c => c.id === id);
      if (collection) {
        setCollection(collection);
      } else {
        setNotFound(true);
      }
    }
  }, [id, stacResponse, isSuccess]);

  const handleTabChange = pivotItem => {
    const { itemKey } = pivotItem.props;
    history.replace({ hash: itemKey });
  };

  const tabs = tabConfig[id]?.tabs?.map(({ title, src, launch }) => {
    return (
      <PivotItem
        className="main-content"
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
  const loadingMsg = (
    <Spinner
      size={SpinnerSize.large}
      styles={{ screenReaderText: "Loading dataset", root: { marginTop: 100 } }}
    />
  );
  const errorMsg = (
    <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
      Sorry, we're having trouble loading this dataset right now
    </MessageBar>
  );
  const overviewPivot = collection && (
    <PivotItem className="main-content" headerText="Overview" itemKey="overview">
      <CollectionProvider collection={collection}>
        <div className="with-sidebar">
          <div>
            <div className="collection-content">
              <h2>Overview</h2>
              <Description />
              <CollectionUrl />
              <Providers />
              <License />
            </div>
            <div style={{ maxWidth: 250 }}>
              <CollectionDetail />
            </div>
          </div>
        </div>
        <Bands />
        <ItemAssets />
        <CubeDimensions />
        <CubeVariables />
        <TableTables />
        <TableColumns />
        <Assets />
      </CollectionProvider>
    </PivotItem>
  );

  const viewerTab = viewerPivot(collection);

  return (
    <Layout bannerHeader={bannerHeader} isShort>
      <SEO title={collection?.title || id} description={collection?.description} />
      {collection ? (
        <Pivot
          className="grid-content"
          selectedKey={activeTab}
          onLinkClick={handleTabChange}
          ariaLabel="Dataset detail tabs"
        >
          {overviewPivot}
          {viewerTab}
          {tabs}
        </Pivot>
      ) : isLoading ? (
        loadingMsg
      ) : isError ? (
        errorMsg
      ) : null}
    </Layout>
  );
};

export default Collection;
