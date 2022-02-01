import axios from "axios";
import { useSession } from "components/auth/hooks/SessionContext";
import { QueryFunctionContext, useQuery, UseQueryResult } from "react-query";
import { IStacFilter, IStacSearchResult } from "types/stac";
import { getStacUrl } from "utils/constants";

const getStacItems = async (
  queryParam: QueryFunctionContext<[string, IStacFilter | undefined, string]>
): Promise<IStacSearchResult> => {
  // eslint-disable-next-line
  const [_, search, stacUrl] = queryParam.queryKey;

  if (typeof search === "undefined") {
    return Promise.reject();
  }

  const resp = await axios.post(`${stacUrl}/search`, search);

  return resp.data;
};

export const useStacSearch = (
  search: IStacFilter | undefined
): UseQueryResult<IStacSearchResult, Error> => {
  const { loggedIn } = useSession();
  const stacUrl = getStacUrl(loggedIn) as string;
  return useQuery(["items", search, stacUrl], getStacItems, {
    keepPreviousData: true, // intended to not clear out search results when panning the map
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    enabled: !!search,
  });
};
