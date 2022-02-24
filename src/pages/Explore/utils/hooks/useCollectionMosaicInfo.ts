import axios from "axios";
import { IMosaicInfo } from "pages/Explore/types";
import { QueryFunctionContext, useQuery } from "react-query";
import { DATA_URL } from "utils/constants";

export const useCollectionMosaicInfo = (collectionId: string | undefined) => {
  return useQuery(["mosaicinfo", collectionId], getCollectionMosaicParams, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(collectionId),
  });
};

const getCollectionMosaicParams = async (
  queryParam: QueryFunctionContext<["mosaicinfo", string | undefined]>
): Promise<IMosaicInfo> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, collectionId] = queryParam.queryKey;

  return await (
    await axios.get(`${DATA_URL}/mosaic/info?collection=${collectionId}`)
  ).data;
};
