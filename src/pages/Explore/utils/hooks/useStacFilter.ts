import { IStacFilter, IStacFilterCollection, IStacFilterGeom } from "types/stac";
import { useStacSearch } from "./useStacSearch";
import { useExploreSelector } from "../../state/hooks";
import { collectionFilter, geomFilter } from "../stac";
import { IMosaic } from "pages/Explore/types";
import { DEFAULT_QUERY_LIMIT } from "../constants";
import { selectCurrentCql } from "pages/Explore/state/mosaicSlice";
import { CqlExpression, CqlInExpression, ICqlExpressionList } from "../cql/types";

export const makeFilterBody = (
  baseFilter: (IStacFilterCollection | IStacFilterGeom | null)[],
  query: IMosaic,
  cql: ICqlExpressionList,
  limit: number | undefined = undefined
): IStacFilter => {
  const optimizedCql = optimizeCqlExpressions(cql);
  return {
    filter: { and: [...baseFilter, ...optimizedCql] },
    sortby: query.sortby || undefined,
    limit: limit,
  } as IStacFilter;
};

const optimizeCqlExpressions = (cql: ICqlExpressionList): ICqlExpressionList => {
  // Some cql expressions can be filtered out of the list and still have the
  // same function query:

  // * IN predicate with an empty list
  const checkEmptyIn = (cql: CqlExpression) => {
    const cqlIn = cql as CqlInExpression<any>;
    if (cqlIn.in !== undefined) {
      return cql.in.list.length;
    }
    return true;
  };

  return cql.filter(checkEmptyIn);
};

export const useCqlFormat = () => {
  const { map, mosaic } = useExploreSelector(s => s);
  const { collection, query, options } = mosaic;
  const cql = useExploreSelector(selectCurrentCql);

  const shouldQuery = () => {
    return collection && cql && options.showResults;
  };

  const collectionFragment = collectionFilter(collection?.id);
  const geometryFragment = geomFilter(map?.bounds);

  const baseFilter = [collectionFragment, geometryFragment];

  return shouldQuery()
    ? makeFilterBody(baseFilter, query, cql, DEFAULT_QUERY_LIMIT)
    : undefined;
};

const useStacFilter = () => {
  const search = useCqlFormat();
  return useStacSearch(search);
};

export default useStacFilter;
