import axios from "axios";
import { IMapInfo } from "pages/Explore/types";
import { QueryFunctionContext, useQuery } from "react-query";
import { DATA_URL } from "utils/constants";

export const useCollectionMapInfo = (collectionId: string) => {
  return useQuery(["mapinfo", collectionId], getCollectionViewerParams, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

const getCollectionViewerParams = async (
  queryParam: QueryFunctionContext<["mapinfo", string | undefined]>
): Promise<IMapInfo> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, collectionId] = queryParam.queryKey;
  const mapInfoResp = await axios.get(
    `${DATA_URL}/collection/map/info?collection=${collectionId}`
  );

  return mapInfoResp.data;
};
