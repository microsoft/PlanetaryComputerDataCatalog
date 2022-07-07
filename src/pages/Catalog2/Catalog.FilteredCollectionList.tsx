import { useEffect, useMemo } from "react";
import { IStackStyles, List, Stack } from "@fluentui/react";
import { isEmpty } from "lodash-es";
import MiniSearch from "minisearch";

import { CatalogCollection } from "./Catalog.Collection";
import { NoResults } from "./Catalog.NoResults";
import { getCollectionShimmers } from "./Catalog.CollectionShimmer";
import { nonApiDatasetToPcCollection } from "./helpers";
import { IPcCollection, IStacCollection } from "types/stac";
import { useCollections } from "utils/requests";
import { useDataConfig } from "components/state/DataConfigProvider";
import { mediaTypeOverride, stacFormatter } from "utils/stac";

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
            console.log(itemAssets);
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

  const searchResults = searchIndex.search(filterText, {
    prefix: true,
    combineWith: "AND",
    weights: { prefix: 0.8, fuzzy: 0 },
  });

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

const includeAllFn = () => true;

const resultStyles: IStackStyles = {
  root: {
    minHeight: "calc(100vh - 250px)",
  },
};
