import { IStacFilter, IStacFilterCollection, IStacFilterGeom } from "types/stac";
import { useStacSearch } from "./useStacSearch";
import { useExploreSelector } from "../../state/hooks";
import { collectionFilter, geomFilter } from "../stac";
import { IMosaic } from "pages/Explore/types";
import { CQL_VALS_IDX, DEFAULT_QUERY_LIMIT } from "../constants";
import {
  selectCurrentCql,
  selectCurrentMosaic,
} from "pages/Explore/state/mosaicSlice";
import { CqlExpression, CqlInExpression, ICqlExpressionList } from "../cql/types";

export const makeFilterBody = (
  baseFilter: (IStacFilterCollection | IStacFilterGeom | null)[],
  query: IMosaic,
  cql: ICqlExpressionList,
  limit: number | undefined = undefined
): IStacFilter => {
  const optimizedCql = optimizeCqlExpressions(cql);
  return {
    "filter-lang": "cql2-json",
    filter: { op: "and", args: [...baseFilter, ...optimizedCql] },
    sortby: query.sortby || undefined,
    limit: limit,
  } as IStacFilter;
};

const optimizeCqlExpressions = (cql: ICqlExpressionList): ICqlExpressionList => {
  // Some cql expressions can be filtered out of the list and still have the
  // same functional query:

  // * IN predicate with an empty list
  const checkEmptyIn = (cql: CqlExpression) => {
    const cqlIn = cql as CqlInExpression<any>;
    if (cqlIn.op === "in") {
      return Boolean(cqlIn.args[CQL_VALS_IDX].length);
    }
    return true;
  };

  return cql.filter(checkEmptyIn);
};

export const useCqlFormat = () => {
  const { map } = useExploreSelector(s => s);
  const { collection, query } = useExploreSelector(selectCurrentMosaic);
  const cql = useExploreSelector(selectCurrentCql);

  const shouldQuery = () => {
    return collection && cql;
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
