import {
  ContextualMenuItemType,
  DefaultButton,
  DirectionalHint,
  getTheme,
  IButtonStyles,
  IContextualMenuItem,
  IIconStyles,
} from "@fluentui/react";
import { sortBy } from "lodash-es";

import { useCollections } from "utils/requests";
import { IStacCollection } from "types/stac";
import { selectCurrentMosaic, setCollection } from "../../../state/mosaicSlice";

import { collections as collectionConfig } from "config/datasets.yml";
import groups from "config/datasetGroups.yml";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { isValidExplorer } from "utils/collections";
import { useUrlStateV2 } from "./hooks/useUrlStateV2";
import { useCallback, useRef, useState } from "react";
import { renderText } from "pages/Explore/utils/dropdownRenderers";

const placeholder = "Select a dataset to visualize";

const CollectionSelectorV2 = () => {
  const dispatch = useExploreDispatch();
  const { isSuccess, data } = useCollections();
  const collections: IStacCollection[] = data?.collections;
  const { collection } = useExploreSelector(selectCurrentMosaic);

  useUrlStateV2();

  const getCollectionById = useCallback(
    (key: string) => {
      return collections.find(c => c.id === key.toString());
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

  const collectionOptions = isSuccess
    ? getSelectorItems(collections, handleItemClick)
    : [];

  const text = collection ? collection.title : placeholder;
  const button = (
    <DefaultButton
      styles={buttonStyles}
      text={text}
      menuProps={{
        items: collectionOptions,
        directionalHint: DirectionalHint.bottomRightEdge,
        onItemClick: handleItemClick,
        useTargetWidth: true,
        styles: {
          subComponentStyles: { menuItem: { root: { maxWidth: "97%" } } },
          header: { fontSize: 14 },
        },
      }}
      onRenderText={renderText("GlobeLocation", text)}
      iconProps={{ styles: chevronStyle }}
    ></DefaultButton>
  );
  return button;
};

export default CollectionSelectorV2;

const getSelectorItems = (
  collections: IStacCollection[],
  clickHandler: any
): IContextualMenuItem[] => {
  const renderable = collections.filter(isValidExplorer).map(c => ({
    text: c.title,
    key: c.id,
    category: collectionConfig[c.id]?.category || "Other",
    groupId: c["msft:group_id"],
  }));

  const catCollections = sortBy(renderable, "text");
  const sortedCollections = sortBy(catCollections, "category");
  const menuItems: IContextualMenuItem[] = [];

  // Group by category, defined in the dataset config
  let lastCategory = "";
  const subMenus: Record<string, IContextualMenuItem[]> = {};

  sortedCollections.forEach(({ key, text, category, groupId }) => {
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
          text: groups[groupId]?.title,
          subMenuProps: { items: subMenus[catKey] },
        });
      }
      // Build up the sub menu
      subMenus[catKey].push({
        key,
        text,
        onClick: clickHandler,
      });
    } else {
      // A top-level, normal collection item
      menuItems.push({ key, text, onClick: clickHandler });
    }

    lastCategory = category;
  });

  console.log(menuItems);
  return menuItems;
};

const theme = getTheme();
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
    "&:hover": {
      backgroundColor: theme.palette.white + " !important",
    },
    "&:active": {
      backgroundColor: theme.palette.white + " !important",
    },
  },
};
