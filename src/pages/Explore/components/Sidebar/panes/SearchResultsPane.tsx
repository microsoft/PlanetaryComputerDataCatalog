import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  FocusZone,
  FocusZoneDirection,
  List,
  MessageBar,
  MessageBarType,
  Separator,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";
import { UseQueryResult } from "react-query";

import { IStacItem, IStacSearchResult } from "types/stac";
import ItemResult from "../../ItemResult";
import ExploreInHub from "../../ExploreInHub";
import SearchResultsHeader from "./SearchResultsHeader";

interface SearchResultsProps {
  request: UseQueryResult<IStacSearchResult, Error>;
}

const SearchResultsPane = ({
  request: { data, isError, isLoading },
}: SearchResultsProps) => {
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    setScrollPos(0);
  }, [isLoading]);

  const handleScroll = useCallback(e => {
    const target = e.target as HTMLTextAreaElement;
    setScrollPos(target.scrollTop);
  }, []);

  if (isLoading) {
    return (
      <>
        <Separator />
        <Spinner size={SpinnerSize.large} />
      </>
    );
  }
  if (isError) {
    return (
      <MessageBar messageBarType={MessageBarType.error}>
        Sorry, we're having trouble completing this search.
      </MessageBar>
    );
  }
  if (!data) return null;

  const renderCell = (item?: IStacItem | undefined): ReactNode => {
    if (!item) return null;
    return <ItemResult item={item} />;
  };

  return (
    <>
      <Separator />
      <SearchResultsHeader results={data} />
      <div className={scrollPos ? "hood on" : "hood"} />
      <div
        className="custom-overflow"
        style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}
        onScroll={handleScroll}
      >
        <FocusZone direction={FocusZoneDirection.vertical}>
          <List items={data.features} onRenderCell={renderCell} />
        </FocusZone>
      </div>
      <ExploreInHub />
    </>
  );
};

export default SearchResultsPane;
