import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  FocusZone,
  FocusZoneDirection,
  IList,
  List,
  MessageBar,
  MessageBarType,
  Separator,
  Spinner,
  Stack,
  getTheme,
  IMessageBarStyles,
} from "@fluentui/react";
import { UseQueryResult } from "react-query";

import { IStacCollection, IStacItem, IStacSearchResult } from "types/stac";
import ItemResult from "../../ItemResult";
import ExploreInHub from "../../ExploreInHub";
import SearchResultsHeader from "./SearchResultsHeader";
import { useExploreSelector } from "pages/Explore/state/hooks";
import ErrorFallback from "components/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";

interface SearchResultsProps {
  request: UseQueryResult<IStacSearchResult, Error>;
  visible: boolean;
}

const SearchResultsPane = ({
  request: { data, isError, isLoading, isPreviousData },
  visible,
}: SearchResultsProps) => {
  const theme = getTheme();
  const { collection } = useExploreSelector(s => s.mosaic);
  const [scrollPos, setScrollPos] = useState(0);
  const listRef: React.RefObject<IList> = useRef(null);
  const lastColRef = useRef<IStacCollection | null>();

  const isCollectionChanged = lastColRef.current !== collection;

  // When the data changes, scroll to the top
  useEffect(() => {
    if (!isPreviousData) {
      setScrollPos(0);
      listRef.current?.scrollToIndex(0);
      // When no longer using previous data, the current collection set
      // reflects the most recent collection used. This is tracked to determine
      // if we need to ignore "previousResults" from the query during a collection
      // filter change
      lastColRef.current = collection;
    }
  }, [collection, isPreviousData]);

  // Track scroll position in order to show/hide the hood effect
  const handleScroll = useCallback(e => {
    const target = e.target as HTMLTextAreaElement;
    setScrollPos(target.scrollTop);
  }, []);

  if (isError) {
    return (
      <>
        <Separator />
        <MessageBar
          messageBarType={MessageBarType.error}
          styles={errorMessageStyles}
        >
          Sorry, we're having trouble completing this search.
        </MessageBar>
      </>
    );
  }
  const loadingIndicator = (
    <>
      <Separator />
      <Spinner />
    </>
  );

  // The logic here is complex.
  // If the collection has changed, and the new collection exists, and the query is returning previous results,
  // don't render the previous results while the new ones are fetched. Show a loading indicator.
  if (collection && isCollectionChanged && isPreviousData) return loadingIndicator;

  // If there is no data, but it is currently being fetched, we show a loading indicator
  if (!data && isLoading) return loadingIndicator;

  // If there is no data, but there is no collection set, we have no query, so don't render anything
  if (!data || !collection) return null;

  // Otherwise, when the collection has stayed the same, we do keep previous
  // results displayed, but dimmed, until the new results come in.

  const renderCell = (item?: IStacItem | undefined): ReactNode => {
    if (!item) return null;
    return <ItemResult item={item} />;
  };

  return (
    <>
      <Stack
        styles={{
          root: {
            background: theme.palette.neutralLighterAlt,
            display: visible ? "flex" : "none",
            height: "100%",
            paddingLeft: 10,
            paddingRight: 10,
            borderTop: `1px solid ${theme.palette.neutralLight}`,
          },
        }}
      >
        <ErrorBoundary FallbackComponent={ErrorFallback}>
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
            data-cy="search-results-list"
          >
            <FocusZone direction={FocusZoneDirection.vertical}>
              <List
                componentRef={listRef}
                items={data?.features}
                onRenderCell={renderCell}
              />
            </FocusZone>
          </div>
        </ErrorBoundary>
      </Stack>
      {visible && <ExploreInHub />}
    </>
  );
};

export default SearchResultsPane;

export const loadingStyle = (inLoadingState: boolean) => ({
  opacity: inLoadingState ? 0.4 : 1,
  transition: "opacity 0.1s ease-in-out",
});

export const errorMessageStyles: IMessageBarStyles = {
  root: { borderRadius: 4, margin: 8, width: "unset" },
};
