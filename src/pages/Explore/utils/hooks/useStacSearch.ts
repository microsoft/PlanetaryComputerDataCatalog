import axios from "axios";
// import { useSession } from "components/auth/hooks/SessionContext";
import { QueryFunctionContext, useQuery, UseQueryResult } from "react-query";
import { IStacFilter, IStacSearchResult } from "types/stac";
import { STAC_URL } from "utils/constants";

const getStacItems = async (
  queryParam: QueryFunctionContext<[string, IStacFilter | undefined]>
): Promise<IStacSearchResult> => {
  const [, search] = queryParam.queryKey;

  if (typeof search === "undefined") {
    return Promise.reject();
  }

  const resp = await axios.post(`${STAC_URL}/search`, search);

  return resp.data;
};

export const useStacSearch = (
  search: IStacFilter | undefined
): UseQueryResult<IStacSearchResult, Error> => {
  // const { status } = useSession();
  return useQuery(["items", search], getStacItems, {
    keepPreviousData: true, // intended to not clear out search results when panning the map
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    enabled: !!search,
  });
};
