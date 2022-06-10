import { useId, useBoolean } from "@fluentui/react-hooks";
import {
  Modal,
  getTheme,
  mergeStyleSets,
  FontWeights,
  DefaultButton,
  IconButton,
  IIconProps,
  Separator,
  Stack,
  IButtonStyles,
} from "@fluentui/react";
import { CatalogFilter } from "pages/Catalog2/Catalog.Filter";
import { useState } from "react";
import { CatalogToc } from "pages/Catalog2/Catalog.Toc";
import { CatalogCollectionList } from "pages/Catalog2/Catalog.CollectionList";
import { CatalogFilteredCollectionList } from "pages/Catalog2/Catalog.FilteredCollectionList";
import { IStacCollection } from "types/stac";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setCollection } from "pages/Explore/state/mosaicSlice";

export const CatalogSelector = () => {
  const dispatch = useExploreDispatch();
  const [filterText, setFilterText] = useState("");
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);

  const titleId = useId("title");

  const handleSelection = (collection: IStacCollection) => {
    dispatch(setCollection(collection));
  };

  return (
    <>
      <DefaultButton text="Select a dataset to visualize" onClick={showModal} />
      <Modal
        isBlocking
        titleAriaId={titleId}
        isOpen={isModalOpen}
        onDismiss={hideModal}
        containerClassName={contentStyles.container}
      >
        <div className={contentStyles.header}>
          <span id={titleId}>Select a dataset</span>
          <CatalogFilter filterText={filterText} onFilterChange={setFilterText} />
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={hideModal}
          />
        </div>
        <Separator />
        <Stack horizontal>
          {!filterText && <CatalogToc />}
          {!filterText && (
            <CatalogCollectionList itemsAsButton setFilterText={setFilterText} />
          )}
          {filterText && (
            <CatalogFilteredCollectionList
              itemsAsButton
              setFilterText={setFilterText}
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
    },
  ],
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
