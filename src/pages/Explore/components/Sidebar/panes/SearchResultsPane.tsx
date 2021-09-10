import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  FocusZone,
  FocusZoneDirection,
  FontSizes,
  FontWeights,
  List,
  MessageBar,
  MessageBarType,
  Separator,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from "@fluentui/react";
import { UseQueryResult } from "react-query";
// @ts-ignore
import * as abbreviate from "number-abbreviate";

import { IStacItem, IStacSearchResult } from "types/stac";
import ItemResult from "../../ItemResult";
import { useExploreSelector } from "pages/Explore/state/hooks";
import ExploreInHub from "../ExploreInHub";

interface SearchResultsProps {
  request: UseQueryResult<IStacSearchResult, Error>;
}

const SearchResultsPane = ({
  request: { data, isError, isLoading },
}: SearchResultsProps) => {
  const collection = useExploreSelector(s => s.mosaic.collection);
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

  const returned = data.features.length;
  const matched = data.context.matched;

  const preamble = matched > returned ? "the first" : "";
  const epilogue = matched > returned ? `(of about ${abbreviate(matched)}) ` : "";

  const renderCell = (item?: IStacItem | undefined): ReactNode => {
    if (!item) return null;
    return <ItemResult item={item} />;
  };

  const withResults = (
    <Text>
      Showing {preamble} {returned} {epilogue} items that matched your search.
    </Text>
  );
  const withoutResults = <Text block>Sorry, no items matched your search.</Text>;
  const resultsText = matched !== 0 ? withResults : withoutResults;

  return (
    <>
      <Separator />
      <Stack tokens={{ childrenGap: 4 }} styles={{ root: { paddingBottom: 6 } }}>
        <Text
          styles={{
            root: { fontSize: FontSizes.medium, fontWeight: FontWeights.bold },
          }}
        >
          {collection?.title}
        </Text>
        {resultsText}
      </Stack>
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
