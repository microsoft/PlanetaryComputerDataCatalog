import {
  ISeparatorStyles,
  IStackStyles,
  List,
  Separator,
  Stack,
} from "@fluentui/react";
import { sortBy } from "lodash-es";

import { IStacCollection } from "types/stac";
import { collections as collectionConfig } from "config/datasets.yml";
import featuredDatasetIds from "config/datasetFeatured.yml";
import groups from "config/datasetGroups.yml";
import { CatalogCollection } from "./Catalog.Collection";
import { useCollections } from "utils/requests";

export const CatalogCollectionList: React.FC = () => {
  const { isLoading, data } = useCollections();

  // TODO shimmer
  if (isLoading) return null;

  const groupedCollections: Record<string, IStacCollection[]> = {};

  data?.collections.forEach(collection => {
    const category = collectionConfig[collection.id].category;
    if (!groupedCollections[category]) {
      groupedCollections[category] = [];
    }
    groupedCollections[category].push(collection);
  });

  const sortedKeys = Object.keys(groupedCollections).sort();

  sortedKeys.unshift("Featured");
  groupedCollections["Featured"] = getFeaturedDatasets(data?.collections);

  const groupedList = sortedKeys.map(category => {
    const collections = groupedCollections[category];
    const sortedCollections = sortBy(collections, "title");
    return (
      <Stack key={`category-${category}`} styles={groupStyles}>
        <h2 id={category} style={headerStyle}>
          {category}
        </h2>
        <Separator styles={separatorStyles} />
        <List items={sortedCollections} onRenderCell={handleCellRender} />
      </Stack>
    );
  });

  return <Stack>{groupedList}</Stack>;
};

const getFeaturedDatasets = (
  collections: IStacCollection[] | undefined
): IStacCollection[] => {
  console.log(featuredDatasetIds);
  const featured = featuredDatasetIds.map(datasetId => {
    if (groups[datasetId]) {
      // Construct a minimal StacCollection from the dataset details
      const { short_description, description, ...group } = groups[datasetId];
      return Object.assign({}, group, {
        "msft:short_description": groups[datasetId].short_description,
        id: "group::" + datasetId,
      });
    }
    return collections?.find(collection => collection.id === datasetId) || null;
  });

  return featured.filter(Boolean) as IStacCollection[];
};

const handleCellRender = (item: IStacCollection | undefined) => {
  if (!item) return null;
  return <CatalogCollection collection={item} />;
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
