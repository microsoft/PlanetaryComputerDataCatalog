import axios from "axios";
import { IMosaicInfo } from "pages/Explore/types";
import { QueryFunctionContext, useQuery } from "react-query";

export const useCollectionMosaicInfo = (collectionId: string | undefined) => {
  return useQuery([collectionId], getCollectionMosaicParams, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!collectionId,
  });
};

const getCollectionMosaicParams = async (
  queryParam: QueryFunctionContext<[string | undefined]>
): Promise<IMosaicInfo> => {
  const [collectionId] = queryParam.queryKey;

  return await (
    await axios.get(`mock/${collectionId}/mosaicInfo.json`)
  ).data;
};
