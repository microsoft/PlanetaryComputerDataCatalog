import { Stack } from "@fluentui/react";
import { IStacSearchResult } from "../../types/stac";
import ItemPreview from "./ItemPreview";

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
    <div>
      <p>
        Showing <strong>{results.features.length}</strong> items that matched your
        search.
      </p>
      <Stack tokens={{ childrenGap: 20, maxWidth: 200 }}>
        {results.features.map(item => (
          <ItemPreview item={item} key={item.id} />
        ))}
      </Stack>
    </div>
  );
};

export default SearchResults;
