import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  FocusZone,
  FocusZoneDirection,
  IList,
  List,
  MessageBar,
  MessageBarType,
  Separator,
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
  request: { data, isError, isPreviousData },
}: SearchResultsProps) => {
  const [scrollPos, setScrollPos] = useState(0);
  const listRef: React.RefObject<IList> = useRef(null);

  // When the data changes, scroll to the top
  useEffect(() => {
    if (!isPreviousData) {
      setScrollPos(0);
      listRef.current?.scrollToIndex(0);
    }
  }, [isPreviousData]);

  // Track scroll position in order to show/hide the hood effect
  const handleScroll = useCallback(e => {
    const target = e.target as HTMLTextAreaElement;
    setScrollPos(target.scrollTop);
  }, []);

  if (isError) {
    return (
      <MessageBar messageBarType={MessageBarType.error}>
        Sorry, we're having trouble completing this search.
      </MessageBar>
    );
  }

  // In practice, this is unlikely, as we retain previous data from the useQuery
  if (!data) return null;

  const renderCell = (item?: IStacItem | undefined): ReactNode => {
    if (!item) return null;
    return <ItemResult item={item} />;
  };
  return (
    <>
      <Separator />
      <SearchResultsHeader results={data} isLoading={isPreviousData} />
      <div className={scrollPos ? "hood on" : "hood"} />
      <div
        className="custom-overflow"
        style={{
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          ...loadingStyle(isPreviousData),
        }}
        onScroll={handleScroll}
      >
        <FocusZone direction={FocusZoneDirection.vertical}>
          <List
            componentRef={listRef}
            items={data.features}
            onRenderCell={renderCell}
          />
        </FocusZone>
      </div>
      <ExploreInHub />
    </>
  );
};

export default SearchResultsPane;

export const loadingStyle = (inLoadingState: boolean) => ({
  opacity: inLoadingState ? 0.6 : 1,
  transition: "opacity 0.1s ease-in-out",
});
