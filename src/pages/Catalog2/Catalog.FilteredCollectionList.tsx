import { useEffect, useMemo } from "react";
import { IStackStyles, Link, List, Stack, Text } from "@fluentui/react";
import { isEmpty } from "lodash-es";
import MiniSearch from "minisearch";

import { CatalogCollection } from "./Catalog.Collection";
import { NoResults } from "./Catalog.NoResults";
import { getCollectionShimmers } from "./Catalog.CollectionShimmer";
import { nonApiDatasetToPcCollection } from "./helpers";
import { IPcCollection, IStacCollection } from "types/stac";
import { useCollections } from "utils/requests";
import { useDataConfig } from "components/state/DataConfigProvider";
import { mediaTypeOverride } from "utils/stac";

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
  preFilterCollectionFn = includeAllFn,
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

  const searchIndex = useMemo(() => {
    console.time("building search index");
    const searchIndex = new MiniSearch({
      fields: [
        "title",
        "msft:short_description",
        "keywords",
        "eo:bands",
        "variables",
        "mediaType",
      ],
      searchOptions: {
        boost: {
          id: 5,
          title: 3,
          "msft:short_description": 2,
          keywords: 2,
        },
      },
      extractField: (collection: IPcCollection, fieldName: string) => {
        switch (fieldName) {
          case "keywords":
            return collection.keywords?.join(" ") || "";
          case "eo:bands":
            return (
              collection.summaries?.["eo:bands"]?.map(
                (eoband: any) => eoband?.common_name
              ) || ""
            );
          case "variables":
            return Object.values(collection?.["cube:variables"] || {})
              .map(v => v?.attrs?.standard_name)
              .join(" ");
          case "mediaType":
            const itemAssets = Object.values(collection.item_assets || {})
              .map(asset => mediaTypeOverride(asset.type))
              .join(" ");
            const collectionAssets = Object.values(collection.assets || {})
              .map(asset => mediaTypeOverride(asset.type))
              .join(" ");
            return `${itemAssets} ${collectionAssets}`;
        }

        return fieldName
          .split(".")
          .reduce((doc: any, key) => doc && doc[key], collection);
      },
    });

    searchIndex.addAll(datasetsToFilter);
    console.timeEnd("building search index");
    return searchIndex;
  }, [datasetsToFilter]);

  const searchOpts = {
    prefix: true,
    combineWith: "AND",
    weights: { prefix: 0.8, fuzzy: 0.8 },
  };
  const searchResults = searchIndex.search(filterText, searchOpts);

  const matchedIds = searchResults.map(r => r.id);

  const filteredCollections = matchedIds
    .map(id => datasetsToFilter.find(c => c.id === id))
    // Remove nulls; type checker isn't picking up that undefineds have been filtered out
    // so cast explcitly. Revist with updates to typescript.
    .filter(Boolean) as IPcCollection[];

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
  const suggestions = !hasResults
    ? searchIndex.autoSuggest(filterText, { ...searchOpts, fuzzy: true })
    : null;
  const suggestion = suggestions?.[0]?.suggestion;
  const searchInstead = suggestion ? (
    <Text styles={suggestionStyles}>
      Did you mean: "
      <Link onClick={() => setFilterText(suggestion)}>{suggestion}</Link>"?
    </Text>
  ) : null;

  return (
    <Stack styles={resultStyles} data-cy="catalog-filter-results">
      <div className="catalog-filter-results-header">
        <h2 style={{ marginBottom: 8 }}>Datasets matching "{filterText}"</h2>
        {!hasResults && searchInstead}
      </div>
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

const includeAllFn = () => true;

const resultStyles: IStackStyles = {
  root: {
    minHeight: "calc(100vh - 250px)",
  },
};

const suggestionStyles = {
  root: {
    fontStyle: "italic",
    fontSize: 15,
  },
};
