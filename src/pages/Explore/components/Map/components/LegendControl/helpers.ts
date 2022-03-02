import axios from "axios";
import { QueryFunctionContext, useQuery } from "react-query";
import { QsParamType } from "types";
import { FileExtValues, IStacCollection } from "types/stac";
import { DATA_URL } from "utils/constants";

export const rootColormapUrl = `${DATA_URL}/legend/colormap`;
export const rootClassmapUrl = `${DATA_URL}/legend/classmap`;

export const hasClassmapValues = (
  collection: IStacCollection | null,
  assets: QsParamType
) => {
  // If the rendering options don't include an asset, it's not a categorical
  if (!assets) return false;

  // Unclear how we would handle multiple categorical assets at once
  if (Array.isArray(assets) || assets.includes(",")) return false;

  // Check the collection for item_asset for the selected asset, and see if it uses file:values
  // which defines the labels for the categorical values
  return collection && "file:values" in collection.item_assets[assets];
};

export const useClassmap = (classmapName: string | null) => {
  return useQuery(["classmap", classmapName], getClassmapByName, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(classmapName),
  });
};

const getClassmapByName = async (
  queryParam: QueryFunctionContext<["classmap", string | null]>
): Promise<Record<string, number[]>> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, classmapName] = queryParam.queryKey;

  return await (
    await axios.get(`${rootClassmapUrl}/${classmapName}`)
  ).data;
};

export const getClassNameByValue = (value: string, fileValues: FileExtValues[]) => {
  const matchingValue = fileValues.find(fv => fv.values.includes(Number(value)));
  return matchingValue?.summary;
};
