import { IDropdownOption } from "@fluentui/react";
import { sortBy } from "lodash-es";

import { useCollections } from "utils/requests";
import { IStacCollection } from "types/stac";
import StateSelector from "./StateSelector";
import { useExploreSelector } from "../../state/hooks";
import { setCollection } from "../../state/mosaicSlice";

const isRenderable = (collection: IStacCollection) =>
  !("cube:variables" in collection);

const CollectionSelector = () => {
  const { isSuccess, data } = useCollections();
  const collections: IStacCollection[] = data?.collections;
  const collection = useExploreSelector(state => state.mosaic.collection);

  const collectionOptions = isSuccess
    ? sortBy(
        collections.filter(isRenderable).map((collection): IDropdownOption => {
          return { key: collection.id, text: collection.title };
        }),
        "text"
      )
    : [];

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
    />
  );
};

export default CollectionSelector;
