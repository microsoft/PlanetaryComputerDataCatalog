import { useId, useBoolean } from "@fluentui/react-hooks";
import {
  Modal,
  getTheme,
  mergeStyleSets,
  FontWeights,
  DefaultButton,
  IconButton,
  IIconProps,
  Stack,
  IButtonStyles,
} from "@fluentui/react";
import { useState } from "react";

import { CatalogToc } from "pages/Catalog2/Catalog.Toc";
import { CatalogCollectionList } from "pages/Catalog2/Catalog.CollectionList";
import { CatalogFilter } from "pages/Catalog2/Catalog.Filter";
import { CatalogFilteredCollectionList } from "pages/Catalog2/Catalog.FilteredCollectionList";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { selectCurrentMosaic, setCollection } from "pages/Explore/state/mosaicSlice";
import { useCollections } from "utils/requests";
import { isValidExplorer } from "utils/collections";

export const CatalogSelector = () => {
  const dispatch = useExploreDispatch();
  const { collection } = useExploreSelector(selectCurrentMosaic);
  const { data: stacCollections } = useCollections();
  const [filterText, setFilterText] = useState("");
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);

  const titleId = useId("exp-selector-title");

  const handleFilterChange = (_: any, newValue?: string | undefined) => {
    setFilterText(newValue || "");
  };

  const handleSelection = (collectionId: string) => {
    if (!stacCollections) return;

    const selectedCollection = stacCollections.collections.find(
      c => c.id === collectionId
    );
    selectedCollection && dispatch(setCollection(selectedCollection));
    hideModal();
  };

  const toc = (
    <div style={tocStyle}>
      <CatalogToc />
    </div>
  );

  const buttonText = collection ? collection.title : "Select a dataset to visualize";
  return (
    <>
      <DefaultButton text={buttonText} onClick={showModal} />
      <Modal
        isBlocking
        titleAriaId={titleId}
        isOpen={isModalOpen}
        onDismiss={hideModal}
        containerClassName={contentStyles.container}
      >
        <div className={contentStyles.header}>
          <span className={contentStyles.title} id={titleId}>
            Select a dataset
          </span>
          <CatalogFilter
            filterText={filterText}
            onFilterChange={handleFilterChange}
          />
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={hideModal}
          />
        </div>
        <Stack horizontal>
          {!filterText && toc}
          {!filterText && (
            <CatalogCollectionList
              itemsAsButton
              includeStorageDatasets={false}
              preFilterCollectionFn={isValidExplorer}
              setFilterText={handleFilterChange}
              onButtonClick={handleSelection}
            />
          )}
          {filterText && (
            <CatalogFilteredCollectionList
              itemsAsButton
              includeStorageDatasets={false}
              preFilterCollectionFn={isValidExplorer}
              setFilterText={handleFilterChange}
              onButtonClick={handleSelection}
              filterText={filterText}
            />
          )}
        </Stack>
      </Modal>
    </>
  );
};

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "stretch",
    maxWidth: 1600,
  },
  header: [
    theme.fonts.large,
    {
      flex: "1 1 auto",
      position: "sticky",
      top: 0,
      background: theme.palette.white,
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: "flex",
      alignItems: "center",
      fontWeight: FontWeights.semibold,
      padding: "12px 12px 14px 24px",
      zIndex: 1,
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
    },
  ],
  title: {
    width: 165,
  },
});

const cancelIcon: IIconProps = { iconName: "Cancel" };

const iconButtonStyles: IButtonStyles = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: "auto",
    marginTop: 4,
    marginRight: 2,
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};

const tocStyle: React.CSSProperties = {
  paddingLeft: 8,
  paddingTop: 4,
  borderRight: `1px solid ${theme.palette.neutralLighter}`,
};
