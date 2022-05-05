import axios from "axios";
import { QueryFunctionContext, useQuery } from "react-query";
import { QsParamType } from "types";
import {
  ClassificationExtClasses,
  FileExtValues,
  IStacCollection,
} from "types/stac";
import { DATA_URL } from "utils/constants";

export const rootColormapUrl = `${DATA_URL}/legend/colormap`;
export const rootClassmapUrl = `${DATA_URL}/legend/classmap`;
export const rootIntervalUrl = `${DATA_URL}/legend/interval`;

// [[[min, max], [r,g,b,a]],...]
export type IntervalMap = [[number, number], [number, number, number, number]][];
export type ClassMap = Record<string, number[]>;

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
  const hasFileValues =
    collection && "file:values" in collection.item_assets[assets];
  const hasClassificationClasses =
    collection && "classification:classes" in collection.item_assets[assets];

  return hasFileValues || hasClassificationClasses;
};

export const fileValuesToClassificationClasses = (
  fv: FileExtValues[] | undefined
) => {
  return fv?.map(f => {
    return { value: f.values[0], description: f.summary };
  });
};

export const useClassmap = (classmapName: string | null) => {
  return useQuery(["classmap", classmapName], getClassmapByName, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(classmapName),
  });
};

const getClassmapByName = async (
  queryParam: QueryFunctionContext<["classmap" | "interval", string | null]>
): Promise<ClassMap> => {
  const [, classmapName] = queryParam.queryKey;

  return await (
    await axios.get(`${rootClassmapUrl}/${classmapName}`)
  ).data;
};

export const getClassNameByValue = (
  value: string,
  classes: ClassificationExtClasses[]
) => {
  const matchingValue = classes.find(fv => fv.value === Number(value));
  return matchingValue?.description;
};

export const useInterval = (intervalName: string | null) => {
  return useQuery(["interval", intervalName], getIntervalClassmapByName, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(intervalName),
  });
};

const getIntervalClassmapByName = async (
  queryParam: QueryFunctionContext<["classmap" | "interval", string | null]>
): Promise<IntervalMap> => {
  const [, classmapName] = queryParam.queryKey;

  return await (
    await axios.get(`${rootIntervalUrl}/${classmapName}`)
  ).data;
};
