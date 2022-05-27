import { IStackStyles, List, Stack } from "@fluentui/react";
import { isEmpty } from "lodash-es";
import NoResults from "pages/Catalog/components/NoResults";
import { IStacCollection } from "types/stac";
import { useCollections } from "utils/requests";
import { CatalogCollection } from "./Catalog.Collection";
import { getCollectionShimmers } from "./Catalog.CollectionShimmer";

interface CatalogFilteredCollectionListProps {
  filterText: string | undefined;
  setFilterText: (filterText: string | undefined) => void;
}

export const CatalogFilteredCollectionList: React.FC<
  CatalogFilteredCollectionListProps
> = ({ filterText, setFilterText }) => {
  const { isLoading, data } = useCollections();

  const filteredCollections = data?.collections?.filter(
    matchesTextAndKeywords(filterText)
  );

  const handleCellRender = (collection: IStacCollection | undefined) => {
    if (!collection) return null;
    return (
      <CatalogCollection
        key={collection.id}
        collection={collection}
        onKeywordClick={setFilterText}
      />
    );
  };

  const hasResults = !isEmpty(filteredCollections) && !isLoading;
  return (
    <Stack styles={resultStyles}>
      <h2>Search results</h2>
      {hasResults && (
        <List items={filteredCollections} onRenderCell={handleCellRender} />
      )}
      {!hasResults && !isLoading && <NoResults />}
      {isLoading && getCollectionShimmers(3)}
    </Stack>
  );
};

const matchesTextAndKeywords = (
  filterText: string | undefined
): ((collection: IStacCollection) => boolean) => {
  return (collection: IStacCollection) => {
    if (!filterText) return true;

    const text = collection.title + collection["msft:short_description"];
    const keywords = collection.keywords;
    const matchesText = text.toLowerCase().includes(filterText.toLowerCase());
    const matchesKeywords =
      keywords?.some(keyword =>
        keyword.toLowerCase().includes(filterText.toLowerCase())
      ) || false;
    return matchesText || matchesKeywords;
  };
};

const resultStyles: IStackStyles = {
  root: {
    minHeight: "calc(100vh - 250px)",
  },
};
