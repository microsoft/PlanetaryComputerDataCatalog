import { Stack } from "@fluentui/react";

import Layout from "components/Layout";
import SEO from "components/Seo";
import { Banner } from "./Catalog.Banner";
import { CatalogCollectionList } from "./Catalog.CollectionList";
import { CatalogToc } from "./Catalog.Toc";

import "styles/catalog.css";

export const Catalog = () => {
  const banner = <Banner />;
  return (
    <Layout bannerHeader={banner}>
      <SEO title="Data Catalog" />
      <Stack horizontal className="grid-content">
        <CatalogToc />
        <CatalogCollectionList />
      </Stack>
    </Layout>
  );
};
