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
  IStackStyles,
} from "@fluentui/react";
import { UseQueryResult } from "react-query";

import { IStacCollection, IStacItem, IStacSearchResult } from "types/stac";
import ItemResult from "../../../ItemResult";
import ExploreInHub from "../../../ExploreInHub";
import SearchResultsHeader from "./SearchResultsHeader";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import ErrorFallback, { handleErrorBoundaryError } from "components/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import NewTabLink from "components/controls/NewTabLink";
import { selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";
import { MobileViewMapButton } from "../../../MobileViewInMap/ViewInMap.index";
import {
  setItemQuickPreview,
  setSelectedItem,
} from "pages/Explore/state/detailSlice";
import { isUndefined } from "lodash-es";

interface SearchResultsProps {
  request: UseQueryResult<IStacSearchResult, Error>;
  visible: boolean;
}

const mobileViewMapStyle = { root: { width: "100%", marginTop: "auto !important" } };
const SearchResultsPane = ({
  request: { data, isError, isFetching, isPreviousData },
  visible,
}: SearchResultsProps) => {
  const dispatch = useExploreDispatch();
  const { collection } = useExploreSelector(selectCurrentMosaic);
  const { previewMode } = useExploreSelector(s => s.detail);
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

  const handleItemPreview = useCallback(
    (index: number) => {
      if (data) {
        const item = data.features[index];
        if (item) {
          if (previewMode.enabled) {
            dispatch(setSelectedItem(item));
          } else {
            dispatch(
              setItemQuickPreview({ items: data.features, currentIndex: index })
            );
          }
        }
      }
    },
    [data, dispatch, previewMode.enabled]
  );

  if (isError) {
    return (
      <>
        <Separator />
        <MessageBar
          messageBarType={MessageBarType.error}
          styles={errorMessageStyles}
        >
          Sorry, we're having trouble completing this search. If the issue persists,
          please consider submitting an issue on our{" "}
          <NewTabLink
            style={{ padding: 0 }}
            href="https://github.com/microsoft/PlanetaryComputer"
          >
            GitHub repo
          </NewTabLink>
          .
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
  if (!data && isFetching) return loadingIndicator;

  // If there is no data, but there is no collection set, we have no query, so don't render anything
  // (except the show map button on mobile).
  if (!data || !collection)
    return (
      <Stack.Item align="center" styles={mobileViewMapStyle}>
        <MobileViewMapButton />
      </Stack.Item>
    );

  // Otherwise, when the collection has stayed the same, we do keep previous
  // results displayed, but dimmed, until the new results come in.

  const renderCell = (item?: IStacItem | undefined, index?: number): ReactNode => {
    if (!item || isUndefined(index)) return null;
    return (
      <ItemResult item={item} index={index} onItemPreview={handleItemPreview} />
    );
  };

  return (
    <>
      <Stack id="explorer-search-results" styles={resultsListStyle}>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onError={handleErrorBoundaryError}
        >
          <SearchResultsHeader results={data} isLoading={isFetching} />
          <div className={scrollPos ? "hood on" : "hood"} />
          <div
            className="custom-overflow"
            style={{
              height: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              ...loadingStyle(isFetching),
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
      {visible && <MobileViewMapButton />}
    </>
  );
};

export default SearchResultsPane;

const theme = getTheme();
export const loadingStyle = (inLoadingState: boolean) => ({
  opacity: inLoadingState ? 0.4 : 1,
  transition: "opacity 0.1s ease-in-out",
});

export const errorMessageStyles: IMessageBarStyles = {
  root: { borderRadius: 4, margin: 8, width: "unset" },
};

const resultsListStyle: Partial<IStackStyles> = {
  root: {
    background: theme.palette.neutralLighterAlt,
    display: "flex",
    height: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 1,
    borderTop: `1px solid ${theme.palette.neutralLight}`,
    overflowY: "auto",
    overflowX: "hidden",
  },
};
