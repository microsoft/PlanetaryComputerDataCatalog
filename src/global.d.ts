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
  launch: string | lauchConfig;
}
interface DatasetEntry {
  category: string;
  headerImg: string;
  tabs: TabEntry[];
  hideInExplorer?: boolean;
  isHidden: boolean;
}
declare module "config/datasets.yml" {
  export const collections: Record<string, DatasetEntry>;
  export const ai4e: any;
}

declare module "config/datasetFeatured.yml" {
  const featuredDatasetIds: string[];
  export default featuredDatasetIds;
}
