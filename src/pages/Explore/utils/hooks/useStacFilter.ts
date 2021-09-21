import { IStacFilter, IStacFilterCollection, IStacFilterGeom } from "types/stac";
import { useStacSearch } from "./useStacSearch";
import { useExploreSelector } from "../../state/hooks";
import { collectionFilter, geomFilter } from "../stac";
import { IMosaic } from "pages/Explore/types";
import { DEFAULT_QUERY_LIMIT } from "../constants";

export const makeFilterBody = (
  baseFilter: (IStacFilterCollection | IStacFilterGeom | null)[],
  query: IMosaic,
  limit: number | undefined = undefined
): IStacFilter => {
  return {
    filter: { and: [...baseFilter, ...(query.cql || [])] },
    sortby: query.sortby || undefined,
    limit: limit,
  } as IStacFilter;
};

export const useCqlFormat = () => {
  const { map, mosaic } = useExploreSelector(s => s);
  const { collection, query, options } = mosaic;

  const shouldQuery = () => {
    return collection && query.cql && options.showResults;
  };

  const collectionFragment = collectionFilter(collection?.id);
  const geometryFragment = geomFilter(map?.bounds);

  const baseFilter = [collectionFragment, geometryFragment];

  return shouldQuery()
    ? makeFilterBody(baseFilter, query, DEFAULT_QUERY_LIMIT)
    : undefined;
};

const useStacFilter = () => {
  const search = useCqlFormat();
  return useStacSearch(search);
};

export default useStacFilter;
