import { IPcCollection } from "types/stac";

export const GROUP_PREFIX = "group::";
export const NON_API_PREFIX = "non-api::";

export const nonApiDatasetToPcCollection = (
  id: string,
  dataset: StorageDatasetEntry
): IPcCollection => {
  return {
    id: `${NON_API_PREFIX}${id}`,
    title: dataset.title,
    "msft:short_description": dataset.short_description,
    description: "",
    keywords: dataset.keywords,
    assets: {
      thumbnail: {
        href: `https://ai4edatasetspublicassets.azureedge.net/assets/pc_thumbnails/additional_datasets/${dataset.thumbnailUrl}`,
      },
    },
  };
};

export const getCollectionDetailUrl = (id: string) => {
  if (id.startsWith(GROUP_PREFIX)) {
    return `/dataset/group/${id.substring(GROUP_PREFIX.length)}`;
  } else if (id.startsWith(NON_API_PREFIX)) {
    return `/dataset/storage/${id.substring(NON_API_PREFIX.length)}`;
  }
  return `/dataset/${id}`;
};
