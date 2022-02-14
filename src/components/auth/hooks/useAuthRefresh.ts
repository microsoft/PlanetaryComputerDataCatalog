import axios from "axios";
import { useQuery } from "react-query";

export const useAuthRefresh = (refetchInterval: number) => {
  return useQuery(
    "api/auth/refresh",
    async () => {
      const res = await axios.get("/api/auth/refresh");
      return res.data;
    },
    {
      enabled: refetchInterval > 0,
      refetchInterval: refetchInterval,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};

export const useAuthStatus = () => {
  return useQuery(
    "user",
    async () => {
      const res = await axios.get("/api/auth/me");
      return res.data;
    },
    {
      retry: false,
    }
  );
};
