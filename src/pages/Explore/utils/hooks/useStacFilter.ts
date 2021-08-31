import { IStacFilter } from "types/stac";
import { useStacSearch } from "./useStacSearch";
import { useExploreSelector } from "../../state/hooks";
import { collectionFilter, geomFilter } from "../stac";

const useStacFilter = () => {
  const { map, mosaic } = useExploreSelector(s => s);
  const { collection, query, options } = mosaic;

  const shouldQuery = () => {
    return collection && query.cql && options.showResults;
  };

  const collectionFragment = collectionFilter(collection?.id);
  const geometryFragment = geomFilter(map.bounds);

  const baseFilter = [collectionFragment, geometryFragment];
  const mosaicFilter = Array.isArray(query.cql) ? query.cql : [];

  const search = shouldQuery()
    ? ({
        filter: { and: [...baseFilter, ...mosaicFilter] },
        sortby: query.sortby || undefined,
        limit: 50,
      } as IStacFilter)
    : undefined;

  return useStacSearch(search);
};

export default useStacFilter;
