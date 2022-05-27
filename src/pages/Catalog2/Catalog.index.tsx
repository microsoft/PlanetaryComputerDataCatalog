import { Stack } from "@fluentui/react";

import Layout from "components/Layout";
import SEO from "components/Seo";
import { CatalogBanner } from "./Catalog.Banner";
import { CatalogCollectionList } from "./Catalog.CollectionList";
import { CatalogToc } from "./Catalog.Toc";

import "styles/catalog.css";
import "./css/Catalog.css";
import { useState } from "react";
import { CatalogFilteredCollectionList } from "./Catalog.FilteredCollectionList";

export const Catalog = () => {
  const [filterText, setFilterText] = useState<string>();

  const handleFilter = (_: any, newValue?: string | undefined) => {
    setFilterText(newValue);
  };

  const banner = (
    <CatalogBanner onFilterChange={handleFilter} filterText={filterText} />
  );
  return (
    <Layout bannerHeader={banner}>
      <SEO title="Data Catalog" />
      <Stack horizontal className="grid-content">
        {!filterText && <CatalogToc />}
        {!filterText && <CatalogCollectionList />}
        {filterText && <CatalogFilteredCollectionList filterText={filterText} />}
      </Stack>
    </Layout>
  );
};
