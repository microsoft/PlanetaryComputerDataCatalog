import axios from "axios";
import { QueryFunctionContext, useQuery, UseQueryResult } from "react-query";
import { IStacSearch, IStacSearchResult } from "../types/stac";
import { MQE_URL } from "./constants";

const getStacItems = async (
  queryParam: QueryFunctionContext<[string, IStacSearch | undefined]>
): Promise<IStacSearchResult> => {
  // eslint-disable-next-line
  const [_, search] = queryParam.queryKey;
  console.log(search);

  if (typeof search === "undefined") {
    return Promise.reject();
  }

  const serializedParams = {
    collections: search.collections.join(","),
    bbox: search.bbox.join(","),
    limit: search.limit,
    datetime: search.datetime,
    ids: search.items?.length ? search.items.join(",") : undefined,
  };

  const resp = await axios.get(`${MQE_URL}/search`, {
    params: serializedParams,
  });

  return resp.data;
};

export const useStacSearch = (
  search: IStacSearch | undefined
): UseQueryResult<IStacSearchResult, Error> => {
  return useQuery(["items", search], getStacItems, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!search,
  });
};
