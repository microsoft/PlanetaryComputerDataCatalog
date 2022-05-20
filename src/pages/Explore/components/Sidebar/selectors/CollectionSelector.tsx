import {
  ContextualMenuItemType,
  DefaultButton,
  DirectionalHint,
  getTheme,
  IButtonStyles,
  Icon,
  IContextualMenuItem,
  IContextualMenuProps,
  IContextualMenuStyles,
  IIconStyles,
} from "@fluentui/react";
import { sortBy } from "lodash-es";

import { useCollections } from "utils/requests";
import { IStacCollection } from "types/stac";
import { selectCurrentMosaic, setCollection } from "../../../state/mosaicSlice";

import { collections as collectionConfig } from "config/datasets.yml";
import groups from "config/datasetGroups.yml";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { useUrlStateV2 } from "./hooks/useUrlStateV2";
import { useCallback, useMemo } from "react";
import { renderText } from "pages/Explore/utils/dropdownRenderers";
import { useCollectionFilter } from "./hooks/useContextSelectorFilter";
import { isValidExplorer } from "utils/collections";

const placeholder = "Select a dataset to visualize";

const CollectionSelectorV2 = () => {
  const dispatch = useExploreDispatch();
  const { isSuccess, isLoading, data } = useCollections();
  const collections = data?.collections;
  const { collection } = useExploreSelector(selectCurrentMosaic);

  useUrlStateV2();

  const getCollectionById = useCallback(
    (key: string) => {
      return collections?.find(c => c.id === key.toString());
    },
    [collections]
  );

  const handleItemClick = useCallback(
    (_, item?: IContextualMenuItem | undefined): boolean | void => {
      const collection = getCollectionById(item?.key as string);
      collection && dispatch(setCollection(collection));
    },
    [dispatch, getCollectionById]
  );
  const { filteredCollections, renderMenuList, handleFilterAbort } =
    useCollectionFilter(collections);

  const collectionOptions = useMemo(() => {
    return getSelectorItems(filteredCollections, handleItemClick);
  }, [filteredCollections, handleItemClick]);

  const menuProps: IContextualMenuProps = useMemo(
    () => ({
      title: "Datasets",
      items: collectionOptions,
      onRenderMenuList: renderMenuList,
      onItemClick: handleItemClick,
      onMenuDismissed: handleFilterAbort,
      directionalHint: DirectionalHint.topAutoEdge,
      useTargetWidth: true,
      styles: contextMenuStyles,
    }),
    [collectionOptions, handleFilterAbort, handleItemClick, renderMenuList]
  );

  const text = collection ? collection.title : placeholder;
  const button = (
    <DefaultButton
      disabled={!isSuccess}
      styles={buttonStyles}
      text={text}
      menuProps={menuProps}
      onRenderText={renderText("GlobeLocation", text, isLoading)}
      iconProps={{ styles: chevronStyle }}
      data-cy="collection-selector"
    ></DefaultButton>
  );
  return button;
};

export default CollectionSelectorV2;

const getSelectorItems = (
  collections: IStacCollection[] | undefined,
  clickHandler: any
): IContextualMenuItem[] => {
  if (!collections || !collections.length) {
    return [
      {
        key: "no_results",
        onRender: () => (
          <div key="no_results" style={filteredItemsStyle}>
            <Icon iconName="SearchIssue" title="No datasets found" />
            <span>No datasets found</span>
          </div>
        ),
      },
    ];
  }

  const renderable =
    collections.filter(isValidExplorer).map(c => ({
      key: c.id,
      text: c.title || c.id,
      title: c["msft:short_description"],
      category: collectionConfig[c.id]?.category || "Other",
      groupId: c["msft:group_id"],
    })) || [];

  const catCollections = sortBy(renderable, "text");
  const sortedCollections = sortBy(catCollections, "category");
  const menuItems: IContextualMenuItem[] = [];

  // Group by category, defined in the dataset config
  let lastCategory = "";
  const subMenus: Record<string, IContextualMenuItem[]> = {};

  sortedCollections.forEach(({ key, text, title, category, groupId }) => {
    // Add a category header if the category has changed
    if (lastCategory !== category) {
      menuItems.push({
        key: `${category}-header`,
        text: category,
        itemType: ContextualMenuItemType.Header,
      });
    }

    // For grouped collections, add a sub menu per collect + categor combination
    // E.g., MODIS under fire as well as MODIS under weather/climate
    if (groupId) {
      const catKey = `${groupId}:${category}`;
      if (!subMenus[catKey]) {
        // New sub category, create a new submenu and parent menu item
        subMenus[catKey] = [];
        menuItems.push({
          key: catKey,
          text: groups[groupId]?.title || groupId,
          subMenuProps: { items: subMenus[catKey] },
        });
      }
      // Build up the sub menu
      subMenus[catKey].push({
        key,
        text,
        title,
        onClick: clickHandler,
      });
    } else {
      // A top-level, normal collection item
      menuItems.push({ key, text, title, onClick: clickHandler });
    }

    lastCategory = category;
  });

  return menuItems;
};

const theme = getTheme();
const contextMenuStyles: Partial<IContextualMenuStyles> = {
  header: { fontSize: 14 },
  title: {
    fontSize: 14,
    background: theme.palette.neutralLighter,
    fontWeight: 500,
    color: theme.palette.themePrimary,
  },
};

const chevronStyle: IIconStyles = {
  root: {
    position: "absolute",
    top: 1,
    right: 8,
    height: 32,
    lineHeight: 30,
    fontSize: 12,
    color: theme.palette.neutralSecondary,
    pointerEvents: "none",
    cursor: "pointer",
  },
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

const filteredItemsStyle: React.CSSProperties = {
  width: "100%",
  height: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
