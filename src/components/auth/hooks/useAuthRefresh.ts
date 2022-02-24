import axios from "axios";
import { useQuery } from "react-query";
import { AUTH_URL } from "utils/constants";

export const useAuthRefresh = (refetchInterval: number) => {
  return useQuery(
    "api/auth/refresh",
    async () => {
      const res = await axios.post(`${AUTH_URL}/auth/refresh`, null, {
        withCredentials: true,
      });
      return res.data;
    },
    {
      enabled: refetchInterval > 0,
      refetchInterval: refetchInterval,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    }
  );
};

export const useAuthStatus = () => {
  return useQuery(
    "/api/auth/me",
    async () => {
      const res = await axios.get(`${AUTH_URL}/auth/me`, {
        withCredentials: true,
      });
      return res.data;
    },
    {
      retry: false,
    }
  );
};
