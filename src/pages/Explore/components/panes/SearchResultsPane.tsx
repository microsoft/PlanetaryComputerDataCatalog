import {
  FocusZone,
  FocusZoneDirection,
  List,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";
import { ReactNode } from "react";
import { UseQueryResult } from "react-query";
import { IStacItem, IStacSearchResult } from "types/stac";
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

  const renderCell = (
    item?: IStacItem | undefined,
    index?: number | undefined,
    isScrolling?: boolean | undefined
  ): ReactNode => {
    if (!item) return null;

    return <ItemResult item={item} />;
  };

  return (
    <>
      <p>
        Showing <strong>{data.features.length}</strong> items that matched your
        search.
      </p>
      <div style={{ height: "100%", overflowY: "auto", overflowX: "clip" }}>
        <FocusZone direction={FocusZoneDirection.vertical}>
          <List items={data.features} onRenderCell={renderCell} />
        </FocusZone>
      </div>
    </>
  );
};

export default SearchResultsPane;
