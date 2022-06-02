import { IStackStyles, List, Stack } from "@fluentui/react";
import { isEmpty, sortBy } from "lodash-es";
import { IPcCollection } from "types/stac";
import { useCollections } from "utils/requests";
import { CatalogCollection } from "./Catalog.Collection";
import { NoResults } from "./Catalog.NoResults";
import { getCollectionShimmers } from "./Catalog.CollectionShimmer";
import { nonApiDatasetToPcCollection } from "./helpers";
import { useMemo } from "react";

interface CatalogFilteredCollectionListProps {
  filterText: string | undefined;
  setFilterText: (filterText: string | undefined) => void;
  nonApiCollectionConfig: Record<string, NonApiDatasetEntry>;
}

export const CatalogFilteredCollectionList: React.FC<
  CatalogFilteredCollectionListProps
> = ({ filterText, setFilterText, nonApiCollectionConfig }) => {
  const { isLoading, data } = useCollections();

  const datasetsToFilter = useMemo(
    () =>
      Object.entries(nonApiCollectionConfig)
        .map(([id, entry]) => nonApiDatasetToPcCollection(id, entry))
        .concat(data?.collections ?? []),
    [data?.collections, nonApiCollectionConfig]
  );

  const filteredCollections = sortBy(
    datasetsToFilter.filter(matchesTextAndKeywords(filterText)),
    "title"
  );

  const handleCellRender = (collection: IPcCollection | undefined) => {
    if (!collection) return null;
    return (
      <CatalogCollection
        key={collection.id}
        collection={collection}
        onKeywordClick={setFilterText}
      />
    );
  };

  const hasResults = !isEmpty(filteredCollections) && !isLoading;
  return (
    <Stack styles={resultStyles} data-cy="catalog-filter-results">
      <h2>Datasets matching "{filterText}"</h2>
      {hasResults && (
        <List
          data-cy="filtered-collection-results"
          items={filteredCollections}
          onRenderCell={handleCellRender}
        />
      )}
      {!hasResults && !isLoading && <NoResults />}
      {isLoading && getCollectionShimmers(3)}
    </Stack>
  );
};

const matchesTextAndKeywords = (
  filterText: string | undefined
): ((collection: IPcCollection) => boolean) => {
  return (collection: IPcCollection) => {
    if (!filterText) return true;

    const text = collection.title + collection["msft:short_description"];
    const keywords = collection.keywords;
    const matchesText = text.toLowerCase().includes(filterText.toLowerCase());
    const matchesKeywords =
      keywords?.some(keyword =>
        keyword.toLowerCase().includes(filterText.toLowerCase())
      ) || false;
    return matchesText || matchesKeywords;
  };
};

const resultStyles: IStackStyles = {
  root: {
    minHeight: "calc(100vh - 250px)",
  },
};
