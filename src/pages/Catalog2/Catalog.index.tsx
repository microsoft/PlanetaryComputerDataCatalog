import { useEffect, useState } from "react";
import { Stack } from "@fluentui/react";

import Layout from "components/Layout";
import SEO from "components/Seo";
import { CatalogBanner } from "./Catalog.Banner";
import { CatalogCollectionList } from "./Catalog.CollectionList";
import { CatalogFilteredCollectionList } from "./Catalog.FilteredCollectionList";
import { CatalogToc } from "./Catalog.Toc";
import { updateQueryStringParam } from "pages/Explore/utils";

import "styles/catalog.css";
import "./css/catalog.css";

export const Catalog: React.FC = () => {
  const [filterText, setFilterText] = useState<string | undefined>(getInitialFilter);

  // Keep the URL in sync with the filter text
  useEffect(() => {
    updateQueryStringParam("filter", filterText);
  }, [filterText]);

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
        {!filterText && <CatalogCollectionList setFilterText={setFilterText} />}
        {filterText && (
          <CatalogFilteredCollectionList
            setFilterText={setFilterText}
            filterText={filterText}
          />
        )}
      </Stack>
    </Layout>
  );
};

const getInitialFilter = () => {
  const filter = new URLSearchParams(window.location.search).get("filter");
  return filter || undefined;
};
