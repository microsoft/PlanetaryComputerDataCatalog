import {
  FontSizes,
  FontWeights,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from "@fluentui/react";

import { IStacSearchResult } from "types/stac";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { loadingStyle } from "./SearchResultsPane";

interface SearchResultsHeaderProps {
  results: IStacSearchResult | undefined;
  isLoading: boolean;
}

const SearchResultsHeader = ({ results, isLoading }: SearchResultsHeaderProps) => {
  const collection = useExploreSelector(s => s.mosaic.collection);

  if (results === undefined) return null;

  const returned = results.features.length;
  const hasNextLink = results.links.find(l => l.rel === "next");
  const plural = returned === 1 ? "item" : "items";
  const preamble = hasNextLink ? "the first" : "";

  const style = {
    root: {
      ...loadingStyle(isLoading),
    },
  };

  const withResults = (
    <Text styles={style}>
      Showing {preamble} {returned} {plural} that matched your search.
    </Text>
  );
  const withoutResults = (
    <Text block styles={style}>
      Sorry, no items matched your search. Try adjusting the query or expand the map
      area.
    </Text>
  );
  const resultsText = returned !== 0 ? withResults : withoutResults;

  return (
    <Stack tokens={{ childrenGap: 4 }} styles={{ root: { paddingBottom: 6 } }}>
      <Stack horizontal tokens={{ childrenGap: 6 }}>
        <Text styles={headerStyles}>{collection?.title}</Text>
        {isLoading && <Spinner size={SpinnerSize.xSmall} />}
      </Stack>
      {resultsText}
    </Stack>
  );
};

export default SearchResultsHeader;

const headerStyles = {
  root: { fontSize: FontSizes.medium, fontWeight: FontWeights.bold },
};
