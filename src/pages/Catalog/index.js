import { useState, useMemo } from "react";
import { Link } from "@fluentui/react";

import Layout from "components/Layout";
import CollectionCard from "components/stac/CollectionCard";
import DefaultBanner from "components/DefaultBanner";
import SEO from "components/Seo";
import { errorMsg, loadingMsg } from "components/stac/CollectionLoaders";

import DatasetCard from "./components/DatasetCard";
import DatasetFilter from "./components/DatasetFilter";
import GroupedCollectionCard from "./components/GroupedCollectionCard";
import NoResults from "./components/NoResults";

import { isort, sortSpecialByKey } from "utils";
import { useCollections } from "utils/requests";
import { ai4e as datasetsConfig } from "config/datasets.yml";

import "styles/catalog.css";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback, { CardErrorFallback } from "components/ErrorFallback";

const computeTags = (collections, datasetsConfig) => {
  if (!collections) return null;
  const collTags = collections.map(c => c.keywords).flat();
  const dsTags = datasetsConfig.map(d => d.keywords || []).flat();
  const combinedTags = new Set(collTags.concat(dsTags));

  // Filter out any falsy elements
  return Array.from(combinedTags)
    .filter(tag => !!tag)
    .sort(isort)
    .map(item => ({ key: item.toLocaleLowerCase(), name: item }));
};

const Catalog = () => {
  // Load STAC Collections from API
  const { isLoading, isSuccess, isError, data: stacResponse } = useCollections();

  // Setup collections + "other" datasets
  const [filteredCollections, setFilteredCollections] = useState();
  const [filteredDatasets, setFilteredDatasets] = useState(datasetsConfig);

  const allTags = useMemo(
    () => computeTags(stacResponse?.collections, datasetsConfig),
    [stacResponse?.collections]
  );

  const banner = (
    <DefaultBanner>
      <h1>Data Catalog</h1>
      <p>
        The Planetary Computer Data Catalog includes petabytes of environmental
        monitoring data, in consistent, analysis-ready formats. All of the datasets
        below can be accessed via Azure Blob Storage, and can be used by developers
        whether you're working within or outside of our Planetary Computer Hub.
      </p>
    </DefaultBanner>
  );

  const getStacCollections = () => {
    if (!filteredCollections) return null;
    if (filteredCollections.length === 0) return <NoResults typeText="API" />;

    return filteredCollections.sort(sortSpecialByKey("title")).map(collection => {
      return collection.groupId ? (
        <GroupedCollectionCard
          key={`card-${collection.groupId}`}
          group={collection}
        />
      ) : (
        <ErrorBoundary
          key={`card-${collection.id}`}
          FallbackComponent={CardErrorFallback}
        >
          <CollectionCard key={`card-${collection.id}`} collection={collection} />
        </ErrorBoundary>
      );
    });
  };

  const primaryDatasets = isLoading
    ? loadingMsg
    : isError
    ? errorMsg
    : getStacCollections();

  const otherDatasets = filteredDatasets.length ? (
    filteredDatasets.map(dataset => {
      return <DatasetCard key={`card-${dataset.title}`} resourceItem={dataset} />;
    })
  ) : (
    <NoResults typeText="Blob Storage" />
  );

  const dataFilter = isSuccess ? (
    <DatasetFilter
      tags={allTags}
      stacCollection={stacResponse.collections}
      datasets={datasetsConfig}
      onStacMatch={setFilteredCollections}
      onDatasetMatch={setFilteredDatasets}
    />
  ) : null;

  return (
    <Layout bannerHeader={banner}>
      <SEO title="Data Catalog" />
      <section id="catalog-api-datasets">
        <div className="grid-content">
          {dataFilter}
          <h2>Datasets available through the Planetary Computer API</h2>
          <p style={{ maxWidth: 800, marginBottom: 40 }}>
            Our largest data sets can be queried and accessed through our Planetary
            Computer API. We are continuing to expand the data available through the
            API, and continuing to bring new data sets to Azure. If you are
            interested in seeing additional data on-boarded or published through our
            API – or if you have data you'd like to contribute –{" "}
            <Link href="https://github.com/microsoft/PlanetaryComputer/discussions/categories/data-request">
              let us know
            </Link>
            .
          </p>
          <div className="layout-container">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <div className="layout-row">{primaryDatasets}</div>
            </ErrorBoundary>
          </div>
        </div>
      </section>

      <section id="catalog-additional-datasets">
        <div className="grid-content">
          <h2>Additional datasets</h2>
          <p style={{ maxWidth: 800, marginBottom: 40 }}>
            The following datasets are available on the Planetary Computer via Azure
            Blob Storage, but are not yet available through our API.
          </p>
          <div className="layout-container">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <div className="layout-row">{otherDatasets}</div>
            </ErrorBoundary>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;
