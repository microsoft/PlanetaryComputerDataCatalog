import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, Stack, Text } from "@fluentui/react";
import { useMediaQuery } from "react-responsive";

import { useQueryString } from "../utils/hooks";
import { useCollections } from "../utils/requests";
import { updateUrl } from "../features/catalog/catalogSlice";

import SEO from "../components/Seo";
import Layout from "../components/Layout";
import CollectionCard from "../components/stac/CollectionCard";
import ResourceCard from "../components/ResourceCard";

import { ai4e as datasetsConfig } from "../config/datasets.yml";
import DefaultBanner from "../components/DefaultBanner";

import "./catalog.css";

import { byKey } from "../utils";

const Catalog = () => {
  const qs = useQueryString();
  const dispatch = useDispatch();
  const catalogUrl = qs.get("catalog");

  useEffect(() => {
    if (catalogUrl) {
      dispatch(updateUrl(catalogUrl));
    }
  });

  const isLarge = useMediaQuery({
    query: "(min-width: 800px)",
  });

  const collectionListStyle = isLarge
    ? {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }
    : undefined;

  const banner = (
    <DefaultBanner>
      <Text block variant="xxLarge">
        Planetary Computer Data Catalog
      </Text>
      <Text block style={{ margin: "1.8rem 0" }}>
        The Planetary Computer Data Catalog includes petabytes of environmental
        monitoring data, in consistent, analysis-ready formats. All of the
        datasets below can be accessed via Azure blob storage, and can be used
        by developers whether you’re working within or outside of our Planetary
        Computer Hub.
      </Text>
    </DefaultBanner>
  );

  const { isLoading, data: collections } = useCollections();

  const primaryDatasets = isLoading ? (
    <div>Loading...</div>
  ) : (
    collections.sort(byKey("title")).map(collection => {
      return (
        <CollectionCard key={`card-${collection.id}`} collection={collection} />
      );
    })
  );

  const otherDatasets = datasetsConfig.map(dataset => {
    return (
      <ResourceCard key={`card-${dataset.title}`} resourceItem={dataset} />
    );
  });

  return (
    <Layout bannerHeader={banner}>
      <SEO title="Data Catalog" />
      <h2>Datasets available through The Planetary Computer API</h2>
      <Text block style={{ maxWidth: 800, marginBottom: 40 }}>
        Our largest data sets can be queried and accessed through our Planetary
        Computer API. We are continuing to expand the data available through the
        API, and continuing to bring new data sets to Azure. If you are
        interested in seeing additional data on-boarded or published through our
        API – or if you have data you’d like to contribute –{" "}
        <Link href="mailto:aiforearthdatasets@microsoft.com">contact us</Link>
      </Text>
      <div className="datasource-container">
        <div className="datasource-row">{primaryDatasets}</div>
      </div>

      <h2>Additional datasets</h2>
      <Text block style={{ maxWidth: 800, marginBottom: 40 }}>
        The following datasets are available on Azure, for use within or outside
        of the Planetary Computer Hub.
      </Text>
      <div className="datasource-container">
        <div className="datasource-row">{otherDatasets}</div>
      </div>
    </Layout>
  );
};

export default Catalog;
