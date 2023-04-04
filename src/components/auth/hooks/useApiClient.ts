import axios, { AxiosInstance } from "axios";
import { useMsalToken } from "./useMsalToken";
import { AI_API_ROOT } from "utils/helpers/constants";

const getConfiguredClient = (accessToken: string): AxiosInstance => {
  const client = axios.create({
    baseURL: AI_API_ROOT,
  });
  client.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return client;
};

export const useAuthApiClient = (): AxiosInstance | undefined => {
  const { accessToken } = useMsalToken();
  if (accessToken) {
    return getConfiguredClient(accessToken);
  }
  return undefined;
};
