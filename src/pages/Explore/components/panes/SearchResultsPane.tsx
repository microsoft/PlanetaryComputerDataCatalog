import { Spinner, SpinnerSize, Stack } from "@fluentui/react";
import { UseQueryResult } from "react-query";
import { IStacSearchResult } from "types/stac";
import ItemResult from "../ItemResult";

interface SearchResultsProps {
  request: UseQueryResult<IStacSearchResult, Error>;
}

const SearchResultsPane = ({
  request: { data, isError, isLoading },
}: SearchResultsProps) => {
  if (isLoading) {
    return <Spinner size={SpinnerSize.large} />;
  }
  if (isError) {
    return <p>Sorry, we're having trouble completing this search.</p>;
  }
  if (!data) return null;

  return (
    <div style={{ height: "100%", overflowY: "auto", overflowX: "clip" }}>
      <p>
        Showing <strong>{data.features.length}</strong> items that matched your
        search.
      </p>
      <Stack tokens={{ childrenGap: 6 }}>
        {data.features.map(item => (
          <ItemResult key={item.id} item={item} />
        ))}
      </Stack>
    </div>
  );
};

export default SearchResultsPane;
