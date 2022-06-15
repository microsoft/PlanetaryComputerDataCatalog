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
  IIconStyles,
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
import { renderText } from "pages/Explore/utils/dropdownRenderers";
import { useUrlStateV2 } from "../hooks/useUrlStateV2";
import { GROUP_PREFIX } from "pages/Catalog2/helpers";
import { CatalogSelectorGroup } from "./CatalogSelector.Group";

export const CatalogSelector = () => {
  const dispatch = useExploreDispatch();
  const { collection } = useExploreSelector(selectCurrentMosaic);
  const { data: stacCollections } = useCollections();
  const [filterText, setFilterText] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>();
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);

  useUrlStateV2();

  const titleId = useId("exp-selector-title");

  const handleFilterChange = (_: any, newValue?: string | undefined) => {
    setFilterText(newValue || "");
  };

  const handleSelection = (collectionId: string) => {
    if (!stacCollections) return;

    if (collectionId.startsWith(GROUP_PREFIX)) {
      setSelectedGroupId(collectionId.substring(GROUP_PREFIX.length));
      return;
    }

    const selectedCollection = stacCollections.collections.find(
      c => c.id === collectionId
    );
    selectedCollection && dispatch(setCollection(selectedCollection));
    hideModal();
  };

  const handleBack = () => {
    setSelectedGroupId(null);
  };

  const toc = (
    <div style={tocStyle}>
      <div style={tocStickyStyle}>
        <CatalogToc
          setHashOnClick={false}
          preFilterCollectionFn={isValidExplorer}
          includeStorageDatasets={false}
        />
      </div>
    </div>
  );

  const groupList = selectedGroupId && (
    <CatalogSelectorGroup
      groupId={selectedGroupId}
      onButtonClick={handleSelection}
      onCloseClick={hideModal}
      onBackClick={handleBack}
    />
  );

  const collectionList = (
    <>
      <div className={contentStyles.header}>
        <span className={contentStyles.title} id={titleId}>
          Select a dataset
        </span>
        <CatalogFilter filterText={filterText} onFilterChange={handleFilterChange} />
        <IconButton
          styles={iconButtonStyles}
          iconProps={cancelIcon}
          ariaLabel="Close popup modal"
          onClick={hideModal}
        />
      </div>
      <Stack horizontal styles={selectorBodyStyles}>
        {!filterText && toc}
        {!filterText && (
          <div style={selectorListStyles}>
            <CatalogCollectionList
              itemsAsButton
              includeStorageDatasets={false}
              preFilterCollectionFn={isValidExplorer}
              setFilterText={handleFilterChange}
              onButtonClick={handleSelection}
            />
          </div>
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
    </>
  );

  const buttonText = collection ? collection.title : "Select a dataset to visualize";

  return (
    <>
      <DefaultButton
        ariaLabel="Select a dataset to visualize"
        title="Select a dataset to visualize"
        text={buttonText}
        onRenderText={renderText("GlobeLocation", buttonText)}
        onClick={showModal}
        styles={buttonStyles}
        iconProps={selectorIconProps}
        data-cy="collection-selector"
      />
      <Modal
        titleAriaId={titleId}
        isOpen={isModalOpen}
        onDismiss={hideModal}
        containerClassName={contentStyles.container}
      >
        {selectedGroupId ? groupList : collectionList}
      </Modal>
    </>
  );
};

const theme = getTheme();
export const contentStyles = mergeStyleSets({
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
      padding: "12px 14px",
      zIndex: 1,
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
    },
  ],
  title: {
    width: 165,
    fontWeight: FontWeights.semibold,
    fontSize: 20,
  },
  titlePadded: {
    paddingLeft: 5,
  },
});

export const cancelIcon: IIconProps = { iconName: "Cancel" };

export const iconButtonStyles: IButtonStyles = {
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

const tocStickyStyle: React.CSSProperties = {
  position: "sticky",
  top: 65,
};

const buttonStyles: Partial<IButtonStyles> = {
  flexContainer: {
    justifyContent: "start",
  },
  root: {
    paddingLeft: 8,
    paddingRight: 4,
    borderColor: theme.palette.neutralTertiaryAlt,
    backgroundColor: theme.palette.white,
  },
  rootHovered: {
    backgroundColor: theme.palette.white,
    borderColor: theme.palette.neutralTertiary,
  },
  rootPressed: {
    backgroundColor: theme.palette.white,
    borderColor: theme.palette.neutralTertiary,
  },
  rootExpanded: {
    backgroundColor: theme.palette.white,
    borderColor: theme.palette.neutralTertiary,
  },
};

const chevronStyle: IIconStyles = {
  root: {
    position: "absolute",
    top: 1,
    right: 4,
    height: 32,
    lineHeight: 30,
    fontSize: 12,
    color: theme.palette.neutralSecondary,
    pointerEvents: "none",
    cursor: "pointer",
    "button:active &": {
      padding: 0,
    },
  },
};

const selectorBodyStyles = { root: { padding: "0 5px" } };
const selectorListStyles = { marginTop: 15 };
const selectorIconProps = { styles: chevronStyle, iconName: "ChevronDown" };
