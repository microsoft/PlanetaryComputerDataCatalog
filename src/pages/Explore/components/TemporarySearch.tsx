import { IStacSearch } from "types/stac";
import { useStacSearch } from "utils/stacSearch";
import SearchResults from "./panes/SearchResultsPane";
import { useExploreSelector } from "./state/hooks";

const TemporarySearch = () => {
  const { map, mosaic } = useExploreSelector(s => s);
  const { collection, query, options } = mosaic;

  const shouldQuery = () => {
    console.log("should query");
    return collection && query.cql && options.showResults;
  };

  const search = shouldQuery()
    ? ({
        collections: [collection?.id ?? ""],
        datetime: "",
        bbox: map.bounds,
        limit: 25,
      } as IStacSearch)
    : undefined;

  const { isError, data } = useStacSearch(search);

  return <SearchResults results={data} isError={isError} />;
};

export default TemporarySearch;
