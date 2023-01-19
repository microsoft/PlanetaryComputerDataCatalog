import axios, { Canceler } from "axios";
import { QueryFunctionContext, useQuery } from "react-query";

import { IMosaic, IMosaicRenderOption } from "pages/Explore/types";
import { ICqlExpressionList } from "pages/Explore/utils/cql/types";
import { makeFilterBody } from "pages/Explore/utils/hooks/useStacFilter";
import { collectionFilter } from "pages/Explore/utils/stac";
import { IStacCollection, IStacItem } from "types/stac";
import { makeRasterTileJsonUrl } from "utils";
import {
  DATA_URL,
  IMAGE_URL,
  REQUEST_ENTITY,
  STAC_URL,
  X_REQUEST_ENTITY,
} from "./constants";
import datasetConfig from "config/datasets.yml";
import { AnimationConfig } from "pages/Explore/components/Sidebar/exporters/AnimationExporter/types";
import { ImageConfig } from "pages/Explore/components/Sidebar/exporters/ImageExporter/types";
import { ImageExportResponse } from "pages/Explore/components/Sidebar/exporters/BaseExporter/types";
import { LayerType } from "pages/Explore/enums";
import { getTileJsonAsset } from "pages/Explore/components/Map/helpers";

export const pcApiClient = axios.create({
  headers: {
    [X_REQUEST_ENTITY]: REQUEST_ENTITY,
  },
});

// Query content can be prefetched if it's likely to be used
export const usePrefetchContent = () => {
  // no-op
};

export const useCollections = () => {
  return useQuery(["stac-collections"], getCollections, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useStaticMetadata = (staticFileName: string) => {
  return useQuery(["static-file", staticFileName], getStaticMetadata);
};

export const useGitHubDatasetDescription = (datasetId: string) => {
  return useQuery(
    ["github-dataset-description", datasetId],
    getGithubDatasetDescription,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    }
  );
};

export const useTileJson = (
  query: IMosaic,
  renderOption: IMosaicRenderOption | null,
  collection: IStacCollection | null,
  item: IStacItem | null
) => {
  return useQuery([query, renderOption, collection, item], getTileJson, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(collection) && Boolean(query.searchId),
  });
};

export const useAnimationExport = (config: AnimationConfig | undefined) => {
  return useQuery(["animation-export", config], getAnimationExport, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    enabled: false,
  });
};

export const useImageExport = (config: ImageConfig) => {
  return useQuery(["image-export", config], getImageExport, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    enabled: false,
  });
};

const getAnimationExport = async (
  queryParam: QueryFunctionContext<[string, AnimationConfig | undefined]>
): Promise<ImageExportResponse> => {
  const config = queryParam.queryKey[1];
  const resp = await pcApiClient.post(`${IMAGE_URL}/animation`, config);

  // For local development, swap out azurite host with localhost
  const { url } = resp.data;
  const animationUrl = url.startsWith("http://azurite")
    ? url.replace("http://azurite", "http://localhost")
    : url;

  return { url: animationUrl };
};

const getImageExport = async (
  queryParam: QueryFunctionContext<[string, ImageConfig]>
): Promise<ImageExportResponse> => {
  const config = queryParam.queryKey[1];
  // const req: ImageExportRequest = {
  //   geometry: config.geometry,
  //   cql: config?.cql,
  //   render_params: config?.render_params,
  //   cols: config?.cols,
  //   rows: config?.rows,
  //   showBranding: config?.showBranding,
  // };
  const resp = await axios.post(`${IMAGE_URL}/image`, config);

  // For local development, swap out azurite host with localhost
  const { url } = resp.data;
  const imageUrl = url.startsWith("http://azurite")
    ? url.replace("http://azurite", "http://localhost")
    : url;

  return { url: imageUrl };
};

export const getTileJson = async (
  queryParam: QueryFunctionContext<
    [IMosaic, IMosaicRenderOption | null, IStacCollection | null, IStacItem | null]
  >
) => {
  return fetchTileJson(...queryParam.queryKey);
};

export const fetchTileJson = async (
  query: IMosaic,
  renderOption: IMosaicRenderOption | null,
  collection: IStacCollection | null,
  item: IStacItem | null = null
) => {
  let url;
  if (renderOption?.type === LayerType.tile) {
    url = makeRasterTileJsonUrl(query, renderOption, collection, item);
  } else if (collection && renderOption) {
    url = getTileJsonAsset(collection, renderOption);
  } else {
    throw new Error("Vector layer requires a collection and render option");
  }

  const resp = await pcApiClient.get(url);
  return resp.data;
};

let registerCancelToken: Canceler | null = null;
export const registerStacFilter = async (
  collectionId: string | undefined,
  queryInfo: IMosaic,
  cql: ICqlExpressionList,
  shouldCancelPrevious: boolean = true
): Promise<string> => {
  if (!collectionId) return "";
  // If there is a register request in-flight, cancel it. This is important because
  // this function is called as a result of an async thunk. If two register requests
  // are made very quickly, the first request may return after the second, causing the
  // map layer to reference the wrong mosaic hash tiles
  shouldCancelPrevious && registerCancelToken && registerCancelToken();

  // Make a new request
  const dataUrl = DATA_URL;
  const body = makeFilterBody([collectionFilter(collectionId)], queryInfo, cql);
  const r = await pcApiClient.post(`${dataUrl}/mosaic/register`, body, {
    cancelToken: new axios.CancelToken(c => (registerCancelToken = c)),
  });
  return r.data.searchid;
};

const getCollections = async (): Promise<{ collections: IStacCollection[] }> => {
  const resp = await pcApiClient.get(`${STAC_URL}/collections`);

  // Collections in the API can be configured to be hidden in all frontend contexts.
  const hiddenCollections = Object.entries(datasetConfig || {})
    .filter(([, config]) => config.isHidden)
    .map(([id]) => id);
  const filteredCollections = resp.data.collections.filter(
    (c: IStacCollection) => !hiddenCollections.includes(c.id)
  );

  return { ...resp.data, collections: filteredCollections };
};

const getStaticMetadata = async (
  queryParam: QueryFunctionContext<[string, string]>
) => {
  const [, file] = queryParam.queryKey;
  const resp = await axios.get(`static/metadata/${file}`);
  return resp.data;
};

const getGithubDatasetDescription = async (
  queryParam: QueryFunctionContext<[string, string]>
): Promise<string | null> => {
  const [, datasetId] = queryParam.queryKey;
  const resp = await axios.get(
    `https://raw.githubusercontent.com/microsoft/AIforEarthDataSets/main/data/${datasetId}.md`
  );

  const text = resp.data as string;
  try {
    const overviewStart = text.indexOf("## Overview");
    return text.substring(overviewStart);
  } catch {
    return null;
  }
};
