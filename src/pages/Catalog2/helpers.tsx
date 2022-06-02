import { IPcCollection } from "types/stac";

export const GROUP_PREFIX = "group::";
export const NON_API_PREFIX = "non-api::";

export const nonApiDatasetToPcCollection = (
  id: string,
  dataset: NonApiDatasetEntry
): IPcCollection => {
  return {
    id: `${NON_API_PREFIX}${id}`,
    title: dataset.title,
    "msft:short_description": dataset.short_description,
    description: dataset.short_description + " TODO",
    keywords: dataset.keywords,
    assets: {
      thumbnail: {
        href: `https://ai4edatasetspublicassets.azureedge.net/assets/pc_thumbnails/additional_datasets/${dataset.thumbnailUrl}`,
      },
    },
  };
};
