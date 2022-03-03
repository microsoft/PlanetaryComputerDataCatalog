import axios from "axios";
import { IMosaicInfo } from "pages/Explore/types";
import { QueryFunctionContext, useQuery } from "react-query";
import { IStacCollection } from "types/stac";
import { DATA_URL, STAC_URL } from "utils/constants";

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
  return await fetchCollectionMosaicInfo(collectionId);
};

export const fetchCollectionMosaicInfo = async (
  collectionId: string | undefined
): Promise<IMosaicInfo> => {
  return await (console.log("fetchCollectionMosaicInfo", collectionId),
  await axios.get(`${DATA_URL}/mosaic/info?collection=${collectionId}`)).data;
};

export const fetchCollection = async (
  collectionId: string
): Promise<IStacCollection> => {
  return await (
    await axios.get(`${STAC_URL}/collections/${collectionId}`)
  ).data;
};
