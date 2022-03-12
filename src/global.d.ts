declare module "*.yml" {
  const data: any;
  export default data;
}

interface launchConfig {
  repo: string;
  branch: string;
  filePath: string;
}
interface tabEntry {
  title: string;
  src: string;
  launch: string | lauchConfig;
}
interface datasetEntry {
  category: string;
  headerImg: string;
  tabs: tabEntry[];
}
declare module "config/datasets.yml" {
  export const collections: Record<string, datasetEntry>;
  export const ai4e: any;
}
