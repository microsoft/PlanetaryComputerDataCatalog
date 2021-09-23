import { FontSizes, FontWeights, Stack, Text } from "@fluentui/react";

import { IStacSearchResult } from "types/stac";
import { useExploreSelector } from "pages/Explore/state/hooks";

interface Props {
  results: IStacSearchResult;
}

const SearchResultsHeader = ({ results }: Props) => {
  const collection = useExploreSelector(s => s.mosaic.collection);
  const returned = results.features.length;
  const hasNextLink = results.links.find(l => l.rel === "next");
  const plural = returned === 1 ? "item" : "items";
  const preamble = hasNextLink ? "the first" : "";

  const withResults = (
    <Text>
      Showing {preamble} {returned} {plural} that matched your search.
    </Text>
  );
  const withoutResults = (
    <Text block>
      Sorry, no items matched your search. Try adjusting the query or expand the map
      area.
    </Text>
  );
  const resultsText = returned !== 0 ? withResults : withoutResults;

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
