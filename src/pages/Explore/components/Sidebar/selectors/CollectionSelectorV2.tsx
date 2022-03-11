import {
  ContextualMenuItemType,
  DefaultButton,
  DirectionalHint,
  IContextualMenuItem,
} from "@fluentui/react";
import { sortBy } from "lodash-es";

import { useCollections } from "utils/requests";
import { IStacCollection } from "types/stac";
import { selectCurrentMosaic, setCollection } from "../../../state/mosaicSlice";

import { collections as collectionConfig } from "config/datasets.yml";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { isValidExplorer } from "utils/collections";
import { useUrlStateV2 } from "./hooks/useUrlStateV2";
import { useCallback, useRef, useState } from "react";
import { renderText } from "pages/Explore/utils/dropdownRenderers";

const CollectionSelectorV2 = () => {
  const dispatch = useExploreDispatch();
  const { isSuccess, data } = useCollections();
  const collections: IStacCollection[] = data?.collections;
  const { collection } = useExploreSelector(selectCurrentMosaic);

  useUrlStateV2();

  const collectionOptions = isSuccess ? selectorItems(collections) : [];
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

  const button = (
    <DefaultButton
      text={collection?.title}
      menuProps={{
        items: collectionOptions,
        directionalHint: DirectionalHint.bottomRightEdge,
        onItemClick: handleItemClick,
      }}
      onRenderText={renderText("GlobeLocation", collection?.title)}
    ></DefaultButton>
  );
  return button;
};

export default CollectionSelectorV2;

const selectorItems = (collections: IStacCollection[]): IContextualMenuItem[] => {
  const renderable = collections.filter(isValidExplorer).map(c => ({
    text: c.title,
    key: c.id,
    category: collectionConfig[c.id]?.category || "Other",
  }));
  const catCollections = sortBy(renderable, "text");
  const sortedCollections = sortBy(catCollections, "category");
  const menuItems: IContextualMenuItem[] = [];

  // Group by category, defined in the dataset config
  let lastCategory = "";
  sortedCollections.forEach(({ key, text, category }) => {
    // Add a category header if the category has changed
    if (lastCategory !== category) {
      menuItems.push({
        key: `${category}-div`,
        text: "-",
        itemType: ContextualMenuItemType.Header,
      });
      menuItems.push({
        key: `${category}-header`,
        text: category,
        itemType: ContextualMenuItemType.Header,
      });
    }
    menuItems.push({ key, text });
    lastCategory = category;
  });

  return menuItems;
};
