import { useCallback } from "react";
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
import { GROUP_PREFIX, nonApiDatasetToPcCollection } from "./helpers";
import { IPcCollection, IStacCollection } from "types/stac";
import { useDataConfig } from "components/state/DataConfigProvider";

interface CatalogCollectionListProps {
  setFilterText: (filterText: string) => void;
}

export const CatalogCollectionList: React.FC<CatalogCollectionListProps> = ({
  setFilterText,
}) => {
  const { collectionConfig, featuredIds, groupConfig, storageCollectionConfig } =
    useDataConfig();
  const { isLoading, data } = useCollections();

  const handleCellRender = useCallback(
    (item: IPcCollection | undefined) => {
      if (!item) return null;
      return <CatalogCollection collection={item} onKeywordClick={setFilterText} />;
    },
    [setFilterText]
  );

  const categorizedCollections = getCategorizedCollections(
    data?.collections,
    storageCollectionConfig,
    isLoading,
    collectionConfig
  );
  const sortedKeys = Object.keys(categorizedCollections).sort();

  sortedKeys.unshift("Featured");
  categorizedCollections["Featured"] = getFeaturedDatasets(
    data?.collections,
    featuredIds,
    groupConfig
  );

  const categorizedList = sortedKeys.map(category => {
    const collections = categorizedCollections[category];
    const sortedCollections = sortBy(collections, "title");

    const items =
      isEmpty(collections) && isLoading ? (
        getCollectionShimmers(3)
      ) : (
        <List items={sortedCollections} onRenderCell={handleCellRender} />
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
      // Construct a minimal StacCollection from the dataset details
      const { short_description, description, ...group } = datasetGroups[datasetId];
      return Object.assign({}, group, {
        "msft:short_description": datasetGroups[datasetId].short_description,
        id: GROUP_PREFIX + datasetId,
      });
    }
    return collections?.find(collection => collection.id === datasetId) || null;
  });

  return featured.filter(Boolean) as IStacCollection[];
};

const getCategorizedCollections = (
  collections: IStacCollection[] | undefined,
  nonApiCollections: Record<string, StorageDatasetEntry>,
  isLoading: boolean,
  collectionConfig: Record<string, DatasetEntry>
): Record<string, IPcCollection[]> => {
  const groupedCollections: Record<string, IPcCollection[]> = {};
  // If collections have loaded, group them by category
  if (collections) {
    collections?.forEach(collection => {
      const category = collectionConfig?.[collection.id]?.category || "Other";
      if (!groupedCollections[category]) {
        groupedCollections[category] = [];
      }
      groupedCollections[category].push(collection);
    });

    // Group the non-api collections as well
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
