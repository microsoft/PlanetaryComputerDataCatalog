import {
  ISeparatorStyles,
  IStackStyles,
  List,
  Separator,
  Stack,
} from "@fluentui/react";
import { isEmpty, sortBy } from "lodash-es";

import { IStacCollection } from "types/stac";
import { collections as collectionConfig } from "config/datasets.yml";
import featuredDatasetIds from "config/datasetFeatured.yml";
import groups from "config/datasetGroups.yml";
import { CatalogCollection } from "./Catalog.Collection";
import { useCollections } from "utils/requests";
import { getCollectionShimmers } from "./Catalog.CollectionShimmer";
import { useCallback } from "react";

export const GROUP_PREFIX = "group::";

interface CatalogCollectionListProps {
  setFilterText: (filterText: string | undefined) => void;
}

export const CatalogCollectionList: React.FC<CatalogCollectionListProps> = ({
  setFilterText,
}) => {
  const { isLoading, data } = useCollections();

  const handleCellRender = useCallback(
    (item: IStacCollection | undefined) => {
      if (!item) return null;
      return <CatalogCollection collection={item} onKeywordClick={setFilterText} />;
    },
    [setFilterText]
  );

  const groupedCollections = getGroupedCollections(data?.collections, isLoading);
  const sortedKeys = Object.keys(groupedCollections).sort();

  sortedKeys.unshift("Featured");
  groupedCollections["Featured"] = getFeaturedDatasets(data?.collections);

  const groupedList = sortedKeys.map(category => {
    const collections = groupedCollections[category];
    const sortedCollections = sortBy(collections, "title");

    const items =
      isEmpty(collections) && isLoading ? (
        getCollectionShimmers(3)
      ) : (
        <List items={sortedCollections} onRenderCell={handleCellRender} />
      );
    return (
      <Stack key={`category-${category}`} styles={groupStyles}>
        <h2 id={category} style={headerStyle}>
          {category}
        </h2>
        <Separator styles={separatorStyles} />
        {items}
      </Stack>
    );
  });

  return <Stack>{groupedList}</Stack>;
};

const getFeaturedDatasets = (
  collections: IStacCollection[] | undefined
): IStacCollection[] => {
  console.log("Getting featured datasets");
  const featured = featuredDatasetIds.map(datasetId => {
    if (groups[datasetId]) {
      // Construct a minimal StacCollection from the dataset details
      const { short_description, description, ...group } = groups[datasetId];
      return Object.assign({}, group, {
        "msft:short_description": groups[datasetId].short_description,
        id: GROUP_PREFIX + datasetId,
      });
    }
    return collections?.find(collection => collection.id === datasetId) || null;
  });

  return featured.filter(Boolean) as IStacCollection[];
};

const getGroupedCollections = (
  collections: IStacCollection[] | undefined,
  isLoading: boolean
): Record<string, IStacCollection[]> => {
  const groupedCollections: Record<string, IStacCollection[]> = {};
  // If collections have loaded, group them by category
  if (collections) {
    collections?.forEach(collection => {
      const category = collectionConfig?.[collection.id]?.category || "Other";
      if (!groupedCollections[category]) {
        groupedCollections[category] = [];
      }
      groupedCollections[category].push(collection);
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
