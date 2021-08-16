import axios from "axios";
import { useQuery } from "react-query";
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

export const useRequest = href => {
  return useQuery([href], getByUrl);
};

export const useCollectionMapInfo = collectionId => {
  return useQuery([collectionId], getCollectionViewerParams, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useCollectionMosaicInfo = collectionId => {
  return useQuery([collectionId], getCollectionMosaicParams, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const getMosaicQueryHashKey = async cql => {
  return axios.get(`/mock/mosaicHashKey.txt?cql=${cql}`);
};

const getByUrl = async ({ queryKey }) => {
  const [url] = queryKey;

  // TODO: remove when #498 is fixed. The STAC `Link` objects don't always
  // reflect the protocol of the request, causing errors in production. As a
  // workaround, upgrade to HTTPS if the current location is HTTPS
  const safeUrl =
    window.location.protocol === "https:" ? url.replace("http:", "https:") : url;
  const resp = await axios.get(safeUrl);
  return resp.data;
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

const getCollectionMosaicParams = async ({ queryKey }) => {
  const [collectionId] = queryKey;

  try {
    return await (
      await axios.get(`mock/${collectionId}/mosaicInfo.json`)
    ).data;
  } catch {
    return faker(collectionId);
  }
};

// TODO: temp
const faker = collectionId => {
  return {
    mosaics: [
      {
        name: `Preset 1 (${collectionId})`,
        description: `${collectionId}-abababa`,
        renderOptions: [
          { name: "Render Option 1", options: "bidx=4,5,6" },
          { name: "Render Option 2", options: "bidx=1,5,6" },
        ],
      },
      {
        name: `Preset 2 (${collectionId})`,
        description: `${collectionId}-cecece`,
        renderOptions: [
          { name: "Render Option 1", options: "bidx=4,5,6" },
          { name: "Render Option 2", options: "bidx=1,5,6" },
        ],
      },
      {
        name: `Preset 3 (${collectionId})`,
        description: `${collectionId}-eoeoeo`,
        renderOptions: [
          { name: "Render Option 1", options: "bidx=4,5,6" },
          { name: "Render Option 2", options: "bidx=1,5,6" },
        ],
      },
    ],
  };
};
