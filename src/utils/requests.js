import axios from "axios";
import { makeFilterBody } from "pages/Explore/utils/hooks/useStacFilter";
import { collectionFilter } from "pages/Explore/utils/stac";
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

export const useTileJson = (query, renderOption, collection, item) => {
  return useQuery([query, renderOption, collection, item], getTileJson, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!collection && !!query.hash,
  });
};

export const getTileJson = async ({ queryKey }) => {
  const [query, renderOption, collection, item] = queryKey;
  const tileJsonUrl = makeTileJsonUrl(query, renderOption, collection, item);

  const resp = await axios.get(tileJsonUrl);
  return resp.data;
};

export const createMosaicQueryHashkey = async (queryInfo, collectionId) => {
  const body = makeFilterBody([collectionFilter(collectionId)], queryInfo);
  const r = await axios.post(`${DATA_URL}/mosaic/register`, body);
  return r.data.searchid;
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
