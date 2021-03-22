import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, Text } from "@fluentui/react";

import { useQueryString } from "../utils/hooks";
import { useCollections } from "../utils/requests";
import { updateUrl } from "../features/catalog/catalogSlice";

import SEO from "../components/Seo";
import Layout from "../components/Layout";
import CollectionCard from "../components/stac/CollectionCard";
import DatasetCard from "../components/DatasetCard";

import { ai4e as datasetsConfig } from "../config/datasets.yml";

const Datasets = () => {
  const qs = useQueryString();
  const dispatch = useDispatch();
  const catalogUrl = qs.get("catalog");

  useEffect(() => {
    if (catalogUrl) {
      dispatch(updateUrl(catalogUrl));
    }
  });

  const banner = (
    <div
      className="ds-list"
      style={{
        background: "#F0F0F0",
        minHeight: "200px",
      }}
    >
      <div className="ds-item">
        <h1>Datasets</h1>
      </div>
      <div className="ds-item">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
      </div>
    </div>
  );
  const { isLoading, data: collections } = useCollections();

  const primaryDatasets = isLoading ? (
    <div>Loading...</div>
  ) : (
    collections.map(collection => {
      return (
        <CollectionCard key={`card-${collection.id}`} collection={collection} />
      );
    })
  );

  const otherDatasets = datasetsConfig.map(dataset => {
    return <DatasetCard key={`card-${dataset.title}`} dataset={dataset} />;
  });

  return (
    <Layout bannerHeader={banner}>
      <SEO title="Datasets" />
      <section className="ds-list">{primaryDatasets}</section>

      <h2>Other datasets</h2>
      <Text block>
        The Microsoft Planetary Computer has access to geospatial data and
        documentation for all the data that is managed by AI for Earth. If you
        have feedback about any of this data, or want to request additions to
        our data program, email us at{" "}
        <Link href="mailto:aiforearthdatasets@microsoft.com">
          aiforearthdatasets@microsoft.com
        </Link>
        .
      </Text>
      <section className="ds-list">{otherDatasets}</section>
    </Layout>
  );
};

export default Datasets;
