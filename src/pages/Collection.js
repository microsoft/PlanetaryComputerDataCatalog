import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import {
  MessageBar,
  MessageBarType,
  Pivot,
  PivotItem,
  Spinner,
  SpinnerSize,
  getTheme,
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

import { useCollections } from "../utils/requests";
import { collections as tabConfig } from "../config/datasets.yml";
import Assets from "../components/stac/Assets";
import CollectionUrl from "components/stac/CollectionUrl";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "components/ErrorFallback";

const Collection = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const pivotRef = useRef();
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

  useEffect(() => {
    if (pivotRef.current) {
      const tabBar = pivotRef.current.querySelector('[role="tablist"]');

      // Keep the tab bar on the right grid
      tabBar?.classList.add("grid-content");

      // Add a class to the tabBar when at the top, so we apply our box shadow style
      const observer = new IntersectionObserver(
        ([e]) => e.target.classList.toggle("is-pinned", e.intersectionRatio < 1),
        { threshold: [1] }
      );
      observer.observe(tabBar);
    }
  });

  const handleTabChange = pivotItem => {
    const { itemKey } = pivotItem.props;
    navigate({ replace: true, hash: itemKey });

    // Handle scroll to sticky-top when switching tabs
    const headerHeight = 360;
    if (window.scrollY > headerHeight) {
      window.scrollTo({ top: headerHeight, behavior: "smooth" });
    }
  };

  const tabs = tabConfig[id]?.tabs?.map(({ title, src, launch }) => {
    return (
      <PivotItem
        className="main-content grid-content"
        key={title}
        headerText={title}
        itemKey={title.replace(/ /g, "-")}
      >
        <MetadataHtmlContent src={src} title={title} launch={launch} />
      </PivotItem>
    );
  });

  if (notFound) {
    return <Navigate replace to={"/404"} />;
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
    <PivotItem
      className="main-content grid-content"
      headerText="Overview"
      itemKey="overview"
    >
      <CollectionProvider collection={collection}>
        <div style={{ marginTop: 32 }}>
          <div className="with-sidebar">
            <div>
              <div className="collection-content">
                <h2 style={{ marginTop: 0 }}>Overview</h2>
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
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Bands />
            <ItemAssets />
            <CubeDimensions />
            <CubeVariables />
            <TableTables />
            <TableColumns />
            <Assets />
          </ErrorBoundary>
        </div>
      </CollectionProvider>
    </PivotItem>
  );

  return (
    <Layout bannerHeader={bannerHeader} isShort>
      <SEO title={collection?.title || id} description={collection?.description} />
      {collection ? (
        <>
          <Pivot
            ref={pivotRef}
            styles={{ root: pivotHeaderStyle }}
            selectedKey={activeTab}
            onLinkClick={handleTabChange}
            ariaLabel="Dataset detail tabs"
          >
            {overviewPivot}
            {tabs}
          </Pivot>
        </>
      ) : isLoading ? (
        loadingMsg
      ) : isError ? (
        errorMsg
      ) : null}
    </Layout>
  );
};

export default Collection;

const theme = getTheme();
const pivotHeaderStyle = {
  position: "sticky",
  top: "-1px",
  zIndex: 1,
  backgroundColor: theme.semanticColors.bodyBackground,
  borderBottom: `1px solid ${theme.semanticColors.bodyDivider}`,
  paddingBottom: 0,
  marginBottom: 4,
  "&.is-pinned": {
    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.5)",
  },
};
