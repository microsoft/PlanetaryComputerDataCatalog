import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useQueryString } from "../utils/hooks";
import { useCollections } from "../utils/requests";
import { updateUrl } from "../features/catalog/catalogSlice";

import SEO from "../components/Seo";
import Layout from "../components/Layout";
import CollectionCard from "../components/stac/CollectionCard";

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

  return (
    <Layout bannerHeader={banner}>
      <SEO title="Datasets" />
      <section className="ds-list">{primaryDatasets}</section>

      <h3>Other datasets</h3>
    </Layout>
  );
};

export default Datasets;
