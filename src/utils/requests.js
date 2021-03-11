import axios from "axios";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { selectUrl } from "../features/catalog/catalogSlice";

const getCollections = async ({ queryKey }) => {
  // eslint-disable-next-line
  const [_key, collectionsUrl] = queryKey;
  const resp = await axios.get(`${collectionsUrl}/collections`);
  return resp.data;
};

export const useCollections = () => {
  const catalogUrl = useSelector(selectUrl);
  return useQuery(["stac", catalogUrl], getCollections);
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

export const getCollectionMetadata = async ({ queryKey }) => {
  const [id] = queryKey;
  const resp = await axios.get(`/static/metadata/${id}.json`);
  return resp.data;
};
