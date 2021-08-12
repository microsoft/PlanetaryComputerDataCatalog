import { Stack } from "@fluentui/react";
import { IStacSearchResult } from "types/stac";
import ItemResult from "../ItemResult";

type SearchResultsProps = {
  results: IStacSearchResult | undefined;
  isError: boolean;
};

const SearchResults = ({ results, isError }: SearchResultsProps) => {
  if (!results) return null;

  if (isError) {
    return <p>Unable to complete search</p>;
  }

  return (
    <div style={{ height: "100%", overflowX: "scroll" }}>
      <p>
        Showing <strong>{results.features.length}</strong> items that matched your
        search.
      </p>
      <Stack tokens={{ childrenGap: 10 }}>
        {results.features.map(item => (
          <ItemResult item={item} />
        ))}
      </Stack>
    </div>
  );
};

export default SearchResults;
