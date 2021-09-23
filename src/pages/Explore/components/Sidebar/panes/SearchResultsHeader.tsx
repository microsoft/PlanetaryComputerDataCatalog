import { FontSizes, FontWeights, Stack, Text } from "@fluentui/react";
// @ts-ignore
import * as abbreviate from "number-abbreviate";

import { IStacSearchResult } from "types/stac";
import { useExploreSelector } from "pages/Explore/state/hooks";

interface Props {
  results: IStacSearchResult;
}

const SearchResultsHeader = ({ results }: Props) => {
  const collection = useExploreSelector(s => s.mosaic.collection);
  const returned = results.features.length;
  const matched = results.context.matched;

  const preamble = matched > returned ? "the first" : "";
  const epilogue = matched > returned ? `(of about ${abbreviate(matched)}) ` : "";
  const withResults = (
    <Text>
      Showing {preamble} {returned} {epilogue} items that matched your search.
    </Text>
  );
  const withoutResults = (
    <Text block>
      Sorry, no items matched your search. Try adjusting search options or the map
      area.
    </Text>
  );
  const resultsText = matched && matched !== 0 ? withResults : withoutResults;

  return (
    <Stack tokens={{ childrenGap: 4 }} styles={{ root: { paddingBottom: 6 } }}>
      <Text styles={headerStyles}>{collection?.title}</Text>
      {resultsText}
    </Stack>
  );
};

export default SearchResultsHeader;

const headerStyles = {
  root: { fontSize: FontSizes.medium, fontWeight: FontWeights.bold },
};
