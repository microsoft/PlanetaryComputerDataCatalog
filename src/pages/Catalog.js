import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Link,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";

import { useQueryString } from "../utils/hooks";
import { useCollections } from "../utils/requests";
import { updateUrl } from "../features/catalog/catalogSlice";

import SEO from "../components/Seo";
import Layout from "../components/Layout";
import CollectionCard from "../components/stac/CollectionCard";
import ResourceCard from "../components/ResourceCard";

import { byKey } from "../utils";
import {
  ai4e as datasetsConfig,
  collections as collectionsConfig,
} from "../config/datasets.yml";
import DefaultBanner from "../components/DefaultBanner";

import "./catalog.css";

const Catalog = () => {
  const qs = useQueryString();
  const dispatch = useDispatch();
  const catalogUrl = qs.get("catalog");

  useEffect(() => {
    if (catalogUrl) {
      dispatch(updateUrl(catalogUrl));
    }
  });

  const banner = (
    <DefaultBanner>
      <h1>Data Catalog</h1>
      <p style={{ margin: "1.8rem 0" }}>
        The Planetary Computer Data Catalog includes petabytes of environmental
        monitoring data, in consistent, analysis-ready formats. All of the
        datasets below can be accessed via Azure blob storage, and can be used
        by developers whether you’re working within or outside of our Planetary
        Computer Hub.
      </p>
    </DefaultBanner>
  );

  const { isLoading, isError, data: collections } = useCollections();

  const errorMsg = (
    <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
      Sorry, we're having trouble loading these datasets right now
    </MessageBar>
  );
  const loadingMsg = <Spinner size={SpinnerSize.large} />;

  const primaryDatasets = isLoading
    ? loadingMsg
    : isError
    ? errorMsg
    : collections.sort(byKey("title")).map(collection => {
        const name = collectionsConfig[collection.id]?.shortTerm;
        return (
          <CollectionCard
            key={`card-${collection.id}`}
            collection={collection}
            shortTerm={name}
          />
        );
      });

  const otherDatasets = datasetsConfig.map(dataset => {
    return (
      <ResourceCard key={`card-${dataset.title}`} resourceItem={dataset} />
    );
  });

  return (
    <Layout bannerHeader={banner}>
      <SEO title="Data Catalog" />
      <section id="catalog-api-datasets">
        <h2>Datasets available through the Planetary Computer API</h2>
        <p style={{ maxWidth: 800, marginBottom: 40 }}>
          Our largest data sets can be queried and accessed through our
          Planetary Computer API. We are continuing to expand the data available
          through the API, and continuing to bring new data sets to Azure. If
          you are interested in seeing additional data on-boarded or published
          through our API – or if you have data you’d like to contribute –{" "}
          <Link href="mailto:aiforearthdatasets@microsoft.com">contact us</Link>
        </p>
        <div className="layout-container">
          <div className="layout-row">{primaryDatasets}</div>
        </div>
      </section>

      <section id="catalog-additional-datasets">
        <h2>Additional datasets</h2>
        <p style={{ maxWidth: 800, marginBottom: 40 }}>
          The following datasets are available on Azure, for use within or
          outside of the Planetary Computer Hub.
        </p>
        <div className="layout-container">
          <div className="layout-row">{otherDatasets}</div>
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;
