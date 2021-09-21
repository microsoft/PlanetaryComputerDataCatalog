declare module "*.yml" {
  const data: any;
  export default data;
}

declare module "config/datasets.yml" {
  export const collections: any;
  export const ai4e: any;
}
