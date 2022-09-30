import { ILegendConfig } from "pages/Explore/types";
import { QueryFunctionContext, useQuery } from "react-query";
import { QsParamType } from "types";
import * as qs from "query-string";
import {
  ClassificationExtClasses,
  FileExtValues,
  IStacCollection,
} from "types/stac";
import { DATA_URL } from "utils/constants";
import { pcApiClient } from "utils/requests";

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

export const useClassmap = (classmapName: string | null, config?: ILegendConfig) => {
  return useQuery(["classmap", classmapName, config], getLegendMappingByName, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(classmapName),
  });
};

export const getClassNameByValue = (
  value: string,
  classes: ClassificationExtClasses[]
) => {
  const matchingValue = classes.find(fv => fv.value === Number(value));
  return matchingValue?.description;
};

export const useInterval = (intervalName: string | null, config?: ILegendConfig) => {
  return useQuery(["interval", intervalName, config], getLegendMappingByName, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(intervalName),
  });
};

const getLegendMappingByName = async (
  queryParam: QueryFunctionContext<
    ["classmap" | "interval", string | null, ILegendConfig | undefined]
  >
): Promise<ClassMap> => {
  const [legendType, classmapName, config] = queryParam.queryKey;

  const qsConfig = config
    ? "?" +
      qs.stringify(
        { trim_start: config.trimStart, trim_end: config.trimEnd },
        { skipNull: true }
      )
    : "";

  const rootUrl = legendType === "classmap" ? rootClassmapUrl : rootIntervalUrl;

  return await (
    await pcApiClient.get(`${rootUrl}/${classmapName}${qsConfig}`)
  ).data;
};
