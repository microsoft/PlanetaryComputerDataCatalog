import { QueryFunctionContext, useQuery, UseQueryResult } from "react-query";
import { IStacFilter, IStacSearchResult } from "types/stac";
import { STAC_URL } from "utils/constants";
import { pcApiClient } from "utils/requests";

const getStacItems = async (
  queryParam: QueryFunctionContext<[string, IStacFilter | undefined]>
): Promise<IStacSearchResult> => {
  const [, search] = queryParam.queryKey;

  if (typeof search === "undefined") {
    return Promise.reject();
  }

  const resp = await pcApiClient.post(`${STAC_URL}/search`, search);

  return resp.data;
};

export const useStacSearch = (
  search: IStacFilter | undefined,
  enabled?: boolean
): UseQueryResult<IStacSearchResult, Error> => {
  return useQuery(["items", search], getStacItems, {
    keepPreviousData: true, // intended to not clear out search results when panning the map
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    enabled: !!search && Boolean(enabled),
  });
};
