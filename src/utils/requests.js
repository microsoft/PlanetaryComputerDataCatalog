import axios from "axios";
import { useQuery } from "react-query";

// Query content can be prefetched if it's likely to be used
export const usePrefetchContent = () => {
  // no-op
};

export const useCollections = () => {
  return useQuery(["stac", process.env.REACT_APP_MQE_URL], getCollections);
};

export const useStaticMetadata = staticFileName => {
  return useQuery([staticFileName], getStaticMetadata);
};

export const getCollectionsByUrl = async ({ queryKey }) => {
  const [url] = queryKey;

  // TODO: remove when #498 is fixed. The STAC `Link` objects don't always
  // reflect the protocol of the request, causing errors in production. As a
  // workaround, upgrade to HTTPS if the current location is HTTPS
  const safeUrl =
    window.location.protocol === "https:"
      ? url.replace("http:", "https:")
      : url;
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
