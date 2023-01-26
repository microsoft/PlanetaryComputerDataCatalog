import { useCallback, useMemo } from "react";
import {
  ISeparatorStyles,
  IStackStyles,
  List,
  Separator,
  Stack,
} from "@fluentui/react";
import { isEmpty, sortBy } from "lodash-es";

import { CatalogCollection } from "./Catalog.Collection";
import { getCollectionShimmers } from "./Catalog.CollectionShimmer";
import { useCollections } from "utils/requests";
import {
  GROUP_PREFIX,
  nonApiDatasetToPcCollection,
  groupToPcCollection,
} from "./helpers";
import { IPcCollection, IStacCollection } from "types/stac";
import { useDataConfig } from "components/state/DataConfigProvider";

interface CatalogCollectionListProps {
  // Text to be used to filter the list of collections by title,
  // short_description, or keywords
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

const smallThumbWidth = 200;
const smallThumbHeight = 112;

export const CatalogCollectionList: React.FC<CatalogCollectionListProps> = ({
  setFilterText,
  includeStorageDatasets = true,
  preFilterCollectionFn = defaultTrueFn,
  itemsAsButton = false,
  onButtonClick = defaultVoidFn,
}) => {
  const { collectionConfig, featuredIds, groupConfig, storageCollectionConfig } =
    useDataConfig();
  const { isLoading, data } = useCollections();

  const collections = useMemo(() => {
    return data ? data.collections.filter(preFilterCollectionFn) : undefined;
  }, [data, preFilterCollectionFn]);

  const handleCellRender = useCallback(
    (item: IPcCollection | undefined) => {
      if (!item) return null;
      return (
        <CatalogCollection
          collection={item}
          onKeywordClick={setFilterText}
          asButton={itemsAsButton}
          onButtonClick={onButtonClick}
        />
      );
    },
    [itemsAsButton, onButtonClick, setFilterText]
  );

  const categorizedCollections = getCategorizedCollections(
    collections,
    includeStorageDatasets ? storageCollectionConfig : {},
    isLoading,
    collectionConfig,
    groupConfig
  );
  const sortedKeys = Object.keys(categorizedCollections).sort();

  sortedKeys.unshift("Featured");
  categorizedCollections["Featured"] = getFeaturedDatasets(
    collections,
    featuredIds,
    groupConfig
  );

  const categorizedList = sortedKeys.map(category => {
    const collections = categorizedCollections[category];
    const sortedCollections = sortBy(collections, "title");

    // If loading, show placeholder shimmers per category. Featured category
    // might have a mix of loading/existing, but we can determine how many shimmers
    // are needed in addition to what is loaded
    const shimmerWidth = itemsAsButton ? smallThumbWidth : undefined;
    const shimmerHeight = itemsAsButton ? smallThumbHeight : undefined;
    const items =
      isEmpty(collections) && isLoading ? (
        getCollectionShimmers(3, shimmerHeight, shimmerWidth)
      ) : (
        <>
          <List items={sortedCollections} onRenderCell={handleCellRender} />
          {isLoading &&
            category === "Featured" &&
            getCollectionShimmers(
              featuredIds.length - sortedCollections.length,
              shimmerHeight,
              shimmerWidth
            )}
        </>
      );

    return (
      <Stack
        key={`category-${category}`}
        styles={groupStyles}
        data-cy={`catalog-category-section-${category}`}
      >
        <h2 id={category} style={headerStyle}>
          {category}
        </h2>
        <Separator styles={separatorStyles} />
        {items}
      </Stack>
    );
  });

  return <Stack>{categorizedList}</Stack>;
};

const getFeaturedDatasets = (
  collections: IStacCollection[] | undefined,
  featuredDatasetIds: string[],
  datasetGroups: Record<string, DatasetGroup>
): IStacCollection[] => {
  const featured = featuredDatasetIds.map(datasetId => {
    if (datasetGroups[datasetId]) {
      return groupToPcCollection(datasetId, datasetGroups[datasetId]);
    }
    return collections?.find(collection => collection.id === datasetId) || null;
  });

  return featured.filter(Boolean) as IStacCollection[];
};

const getCategorizedCollections = (
  collections: IStacCollection[] | undefined,
  nonApiCollections: Record<string, StorageDatasetEntry>,
  isLoading: boolean,
  collectionConfig: Record<string, DatasetEntry>,
  groupConfig: Record<string, DatasetGroup>
): Record<string, IPcCollection[]> => {
  const groupedCollections: Record<string, IPcCollection[]> = {};
  // If collections have loaded, group them by category
  if (collections) {
    collections?.forEach(collection => {
      const category = collectionConfig?.[collection.id]?.category || "Other";
      if (!groupedCollections[category]) {
        groupedCollections[category] = [];
      }

      const groupId = collection["msft:group_id"];
      const group = groupId ? groupConfig[groupId] : null;
      if (groupId && group && group?.groupOnCatalog !== false) {
        if (
          !groupedCollections[category].find(c => c.id === GROUP_PREFIX + groupId)
        ) {
          // Either enter the group as a collection or add the collection directly if
          // it is the only one in the group that passed a pre-filter.
          const others = collections.filter(
            c => c["msft:group_id"] === groupId && c.id !== collection.id
          );
          if (others.length === 0) {
            groupedCollections[category].push(collection);
          } else {
            groupedCollections[category].push(groupToPcCollection(groupId, group));
          }
        }
      } else {
        groupedCollections[category].push(collection);
      }
    });

    // Categorize the non-api collections as well
    Object.entries(nonApiCollections).forEach(([id, nonApiCollection]) => {
      const category = nonApiCollection.category || "Other";
      if (!groupedCollections[category]) {
        groupedCollections[category] = [];
      }
      groupedCollections[category].push(
        nonApiDatasetToPcCollection(id, nonApiCollection)
      );
    });
  } else if (!collections && isLoading) {
    // If they're still loading, show a placeholder for each category from the main config
    Object.entries(collectionConfig).forEach(([_, config]) => {
      if (config.category) {
        groupedCollections[config.category] = [];
      }
    });
  }

  return groupedCollections;
};

const headerStyle: React.CSSProperties = {
  margin: 0,
};

const groupStyles: IStackStyles = {
  root: {
    marginBottom: 20,
  },
};

const separatorStyles: Partial<ISeparatorStyles> = {
  root: {
    paddingBottom: 10,
    paddingTop: 0,
  },
};
const defaultTrueFn = () => true;
const defaultVoidFn = () => {};
