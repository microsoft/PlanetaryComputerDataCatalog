import axios from "axios";

export const getCollections = async () => {
  const resp = await axios.get(process.env.REACT_APP_MQE_URL);
  return resp.data;
};

export const getCollectionsByUrl = async ({ queryKey }) => {
  const [url] = queryKey;
  const resp = await axios.get(url);
  return resp.data;
};

export const getCollectionMetadata = async ({ queryKey }) => {
  const [id] = queryKey;
  const resp = await axios.get(`/static/metadata/${id}.json`);
  return resp.data;
};
