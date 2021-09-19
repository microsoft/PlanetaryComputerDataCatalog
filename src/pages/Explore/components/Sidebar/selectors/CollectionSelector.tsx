import { DropdownMenuItemType, IDropdownOption } from "@fluentui/react";
import { sortBy } from "lodash-es";

import { useCollections } from "utils/requests";
import { IStacCollection } from "types/stac";
import StateSelector from "./StateSelector";
import { setCollection } from "../../../state/mosaicSlice";

import { collections as collectionConfig } from "config/datasets.yml";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { useCollectionUrlState } from "./hooks/useUrlState";

const CollectionSelector = () => {
  const { isSuccess, data } = useCollections();
  const collections: IStacCollection[] = data?.collections;
  const collection = useExploreSelector(state => state.mosaic.collection);

  // Sets selector values based off of url state
  useCollectionUrlState(collections);

  const collectionOptions = isSuccess ? sortedOptions(collections) : [];

  const getCollectionById = (key: string | number) => {
    return collections.find(c => c.id === key.toString());
  };

  return (
    <StateSelector
      title="Select a dataset"
      icon="World"
      action={setCollection}
      options={collectionOptions}
      selectedKey={collection?.id}
      getStateValFn={getCollectionById}
      disabled={!isSuccess}
    />
  );
};

export default CollectionSelector;

const isRenderable = (collection: IStacCollection) => {
  // By default, all collections with at least one GeoTIFF data-role item_asset
  // are renderable
  if (collection.item_assets) {
    return !!Object.values(collection.item_assets).find(a =>
      a.type?.toLowerCase().includes("geotiff")
    );
  }
  return false;
};

const sortedOptions = (collections: IStacCollection[]) => {
  const renderable = collections.filter(isRenderable).map(c => ({
    text: c.title,
    key: c.id,
    category: collectionConfig[c.id]?.category || "Other",
  }));
  const catCollections = sortBy(renderable, "text");
  const sortedCollections = sortBy(catCollections, "category");
  const options: IDropdownOption[] = [];

  let lastCategory = "";
  sortedCollections.forEach(({ key, text, category }) => {
    // Add a category header if the category has changed
    if (lastCategory !== category) {
      options.push({
        key: `${category}-div`,
        text: "-",
        itemType: DropdownMenuItemType.Divider,
      });
      options.push({
        key: `${category}-header`,
        text: category,
        itemType: DropdownMenuItemType.Header,
      });
    }
    options.push({ key, text });
    lastCategory = category;
  });

  return options;
};
