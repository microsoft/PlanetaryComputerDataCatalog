import axios from "axios";
import { useQuery } from "react-query";
import { makeTileJsonUrl } from "utils";
import { DATA_URL, STAC_URL } from "./constants";

// Query content can be prefetched if it's likely to be used
export const usePrefetchContent = () => {
  // no-op
};

export const useCollections = () => {
  return useQuery(["stac", STAC_URL], getCollections, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useStaticMetadata = staticFileName => {
  return useQuery([staticFileName], getStaticMetadata);
};

export const useCollectionMapInfo = collectionId => {
  return useQuery([collectionId], getCollectionViewerParams, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useTileJson = (collection, query, renderOption, item) => {
  return useQuery([collection, query, renderOption, item], getTileJson, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!collection && !!query.hash,
  });
};

export const getTileJson = async ({ queryKey }) => {
  const [collection, query, renderOption, item] = queryKey;
  const tileJsonUrl = makeTileJsonUrl(collection, query, renderOption, item);

  const resp = await axios.get(tileJsonUrl);
  return resp.data;
};

export const getMosaicQueryHashKey = async cql => {
  return axios.get(`/mock/mosaicHashKey.txt?cql=${cql}`);
};

const getCollections = async ({ queryKey }) => {
  // eslint-disable-next-line
  const [_key, collectionsUrl] = queryKey;
  const resp = await axios.get(`${collectionsUrl}/collections`);
  return resp.data;
};

const getStaticMetadata = async ({ queryKey }) => {
  const [file] = queryKey;
  const resp = await axios.get(`static/metadata/${file}`);
  return resp.data;
};

const getCollectionViewerParams = async ({ queryKey }) => {
  const [collectionId] = queryKey;
  const mapInfoResp = await axios.get(
    `${DATA_URL}/collection/map/info?collection=${collectionId}`
  );

  return {
    info: mapInfoResp.data,
  };
};
