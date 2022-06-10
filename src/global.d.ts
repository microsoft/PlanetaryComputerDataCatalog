declare module "*.yml" {
  const data: any;
  export default data;
}

interface LaunchConfig {
  repo: string;
  branch: string;
  filePath: string;
}
interface TabEntry {
  title: string;
  src: string;
  launch: string | launchConfig;
}
interface DatasetEntry {
  category: string;
  headerImg?: string;
  tabs?: TabEntry[];
  hideInExplorer?: boolean;
  isHidden?: boolean;
}

interface StorageDatasetEntry {
  title: string;
  category: string;
  short_description: string;
  infoUrl: string;
  thumbnailUrl: string;
  keywords: string[];
}

declare module "config/datasets.yml" {
  const collections: Record<string, DatasetEntry>;
  export default collections;
  export const storageCollections: Record<string, StorageDatasetEntry>;
}

declare module "config/storageDatasets.yml" {
  export const storageCollections: Record<string, StorageDatasetEntry>;
  export default storageCollections;
}

declare module "config/datasetFeatured.yml" {
  const featuredDatasetIds: string[];
  export default featuredDatasetIds;
}

interface DatasetGroup {
  title: string;
  short_description: string;
  description: string;
  assets: {
    headerImg: {
      href: string;
    };
    thumbnail: {
      href: string;
    };
  };
  keywords: string[];

  // Should group members be categorized on the catalog page?
  // Defaults to true.
  groupOnCatalog?: boolean;
}

declare module "config/datasetGroups.yml" {
  const datasetGroups: Record<string, DatasetGroup>;
  export default datasetGroups;
}
