import axios, { Canceler } from "axios";
import { IMosaic, IMosaicRenderOption } from "pages/Explore/types";
import { ICqlExpressionList } from "pages/Explore/utils/cql/types";
import { makeFilterBody } from "pages/Explore/utils/hooks/useStacFilter";
import { collectionFilter } from "pages/Explore/utils/stac";
import { QueryFunctionContext, useQuery } from "react-query";
import { IStacCollection, IStacItem } from "types/stac";
import { makeTileJsonUrl } from "utils";
import { DATA_URL, STAC_URL } from "./constants";
// import { useSession } from "components/auth/hooks/SessionContext";

// Query content can be prefetched if it's likely to be used
export const usePrefetchContent = () => {
  // no-op
};

export const useCollections = () => {
  return useQuery(["stac-collections"], getCollections, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useStaticMetadata = (staticFileName: string) => {
  return useQuery(["static-file", staticFileName], getStaticMetadata);
};

export const useTileJson = (
  query: IMosaic,
  renderOption: IMosaicRenderOption | null,
  collection: IStacCollection | null,
  item: IStacItem | null
) => {
  return useQuery([query, renderOption, collection, item], getTileJson, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(collection) && Boolean(query.searchId),
  });
};

export const getTileJson = async (
  queryParam: QueryFunctionContext<
    [IMosaic, IMosaicRenderOption | null, IStacCollection | null, IStacItem | null]
  >
) => {
  const [query, renderOption, collection, item] = queryParam.queryKey;
  const tileJsonUrl = makeTileJsonUrl(query, renderOption, collection, item);

  const resp = await axios.get(tileJsonUrl);
  return resp.data;
};

let registerCancelToken: Canceler | null = null;
export const registerStacFilter = async (
  collectionId: string | undefined,
  queryInfo: IMosaic,
  cql: ICqlExpressionList,
  shouldCancelPrevious: boolean = true
): Promise<string> => {
  if (!collectionId) return "";
  // If there is a register request in-flight, cancel it. This is important because
  // this function is called as a result of an async thunk. If two register requests
  // are made very quickly, the first request may return after the second, causing the
  // map layer to reference the wrong mosaic hash tiles
  shouldCancelPrevious && registerCancelToken && registerCancelToken();

  // Make a new request
  const dataUrl = DATA_URL;
  const body = makeFilterBody([collectionFilter(collectionId)], queryInfo, cql);
  const r = await axios.post(`${dataUrl}/mosaic/register`, body, {
    cancelToken: new axios.CancelToken(c => (registerCancelToken = c)),
  });
  return r.data.searchid;
};

const getCollections = async (): Promise<{ collections: IStacCollection[] }> => {
  const resp = await axios.get(`${STAC_URL}/collections`);
  return resp.data;
};

const getStaticMetadata = async (
  queryParam: QueryFunctionContext<[string, string]>
) => {
  const [, file] = queryParam.queryKey;
  const resp = await axios.get(`static/metadata/${file}`);
  return resp.data;
};
