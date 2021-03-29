import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, Text } from "@fluentui/react";

import { useQueryString } from "../utils/hooks";
import { useCollections } from "../utils/requests";
import { updateUrl } from "../features/catalog/catalogSlice";

import SEO from "../components/Seo";
import Layout from "../components/Layout";
import CollectionCard from "../components/stac/CollectionCard";
import ResourceCard from "../components/ResourceCard";

import { ai4e as datasetsConfig } from "../config/datasets.yml";
import DefaultBanner from "../components/DefaultBanner";

import { byKey } from "../utils";

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
    <DefaultBanner>
      <Text block variant="xxLarge">
        Planetary Computer Data Catalog
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
      <Text block variant="large" style={{ margin: "1.8rem 0" }}>
        The Planetary Computer Data Catalog includes petabytes of environmental
        monitoring data, in consistent, analysis-ready formats. All of the
        datasets below can be accessed via Azure blob storage, and can be used
        by developers whether you’re working within or outside of our Planetary
        Computer Hub. Our largest data sets can be also queried and accessed
        through our Planetary Computer API. We are continuing to expand the data
        available through the API, and continuing to bring new data sets to
        Azure. If you are interested in seeing additional data on-boarded or
        published through our API – or if you have data you’d like to contribute
        – <Link href="mailto:aiforearthdatasets@microsoft.com">contact us</Link>{" "}
        .
      </Text>
      <section className="column-list">{primaryDatasets}</section>

      <h2>Additional datasets</h2>
      <Text block>
        The following datasets are available on Azure, for use within or outside
        of the Planetary Computer Hub.
      </Text>
      <section className="column-list">{otherDatasets}</section>
    </Layout>
  );
};

export default Datasets;
