import { useEffect, useMemo } from "react";
import { IStackStyles, List, Stack } from "@fluentui/react";
import { isEmpty, sortBy } from "lodash-es";

import { CatalogCollection } from "./Catalog.Collection";
import { NoResults } from "./Catalog.NoResults";
import { getCollectionShimmers } from "./Catalog.CollectionShimmer";
import { nonApiDatasetToPcCollection } from "./helpers";
import { IPcCollection, IStacCollection } from "types/stac";
import { useCollections } from "utils/requests";
import { useDataConfig } from "components/state/DataConfigProvider";

interface CatalogFilteredCollectionListProps {
  filterText: string;
  setFilterText: (filterText: string) => void;
  // Include storage datasets in the output
  includeStorageDatasets?: boolean;

  // Optional filter function to display only subset of collections
  preFilterCollectionFn?: (collection: IStacCollection) => boolean;

  // Treat the entire collection entry as a button
  itemsAsButton?: boolean;

  // Callback for when itemAsButton is true and clicked
  onButtonClick?: (collectionId: string) => void;
}

export const CatalogFilteredCollectionList: React.FC<
  CatalogFilteredCollectionListProps
> = ({
  filterText,
  setFilterText,
  includeStorageDatasets = true,
  preFilterCollectionFn = () => true,
  itemsAsButton = false,
  onButtonClick,
}) => {
  const { storageCollectionConfig } = useDataConfig();
  const { isLoading, data } = useCollections();

  // Scroll to top when re-rendering due to filterText change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [filterText]);

  // Build up the list of collections that are eligible for filtering
  const datasetsToFilter = useMemo(() => {
    const storageCollections = includeStorageDatasets
      ? Object.entries(storageCollectionConfig)
      : [];
    const collections = data?.collections
      ? data.collections.filter(preFilterCollectionFn)
      : [];

    return storageCollections
      .map(([id, entry]) => nonApiDatasetToPcCollection(id, entry))
      .concat(collections);
  }, [data, includeStorageDatasets, preFilterCollectionFn, storageCollectionConfig]);

  // Sorted list of PC collections that match the filterText
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
        asButton={itemsAsButton}
        onButtonClick={onButtonClick}
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
  filterText: string
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
