import React, { createContext } from "react";

//eslint-disable-next-line
import collections from "config/datasets.yml";
import storageCollections from "config/storageDatasets.yml";
import groups from "config/datasetGroups.yml";
import featuredCollections from "config/datasetFeatured.yml";

export interface DataConfigContextProps {
  collectionConfig: Record<string, DatasetEntry>;
  storageCollectionConfig: Record<string, StorageDatasetEntry>;
  groupConfig: Record<string, DatasetGroup>;
  featuredIds: string[];
}

const initialState: DataConfigContextProps = {
  collectionConfig: collections,
  storageCollectionConfig: storageCollections,
  groupConfig: groups, featuredIds: featuredCollections,
};

const DataConfigContext = createContext<DataConfigContextProps>(initialState);

export const DataConfigProvider: React.FC<DataConfigContextProps> = ({
  children,
  collectionConfig,
  storageCollectionConfig,
  groupConfig,
  featuredIds,
}) => {
  const context: DataConfigContextProps = {
    collectionConfig,
    storageCollectionConfig,
    groupConfig,
    featuredIds,
  };

  return (
    <DataConfigContext.Provider value={context}>
      {children}
    </DataConfigContext.Provider>
  );
};

export const useDataConfig = () => {
  const context = React.useContext(DataConfigContext);
  if (context === undefined) {
    throw new Error("useDataConfig must be used within a DataConfigProvider");
  }
  return context;
};
