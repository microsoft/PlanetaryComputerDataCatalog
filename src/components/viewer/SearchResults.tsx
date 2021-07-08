import { IStacSearchResult } from "../../types/stac";

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
    </div>
  );
};

export default SearchResults;
