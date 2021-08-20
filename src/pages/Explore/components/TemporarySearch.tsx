import { IStacSearch } from "types/stac";
import { useStacSearch } from "utils/stacSearch";
import SearchResultsPane from "./panes/SearchResultsPane";
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
        limit: 35,
      } as IStacSearch)
    : undefined;

  const request = useStacSearch(search);

  return <SearchResultsPane request={request} />;
};

export default TemporarySearch;
