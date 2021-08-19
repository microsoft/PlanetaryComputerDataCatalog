import { IDropdownOption } from "@fluentui/react";
import { sortBy } from "lodash-es";

import { useCollections } from "utils/requests";
import { IStacCollection } from "types/stac";
import StateSelector from "./StateSelector";
import { useExploreSelector } from "../state/hooks";
import { setCollection } from "../state/mosaicSlice";

const CollectionSelector = () => {
  const { isSuccess, data: stacResponse } = useCollections();
  const collection = useExploreSelector(state => state.mosaic.collection);

  const collectionOptions = isSuccess
    ? sortBy(
        (stacResponse?.collections as IStacCollection[])
          .filter(collection => !("cube:variables" in collection))
          .map((collection): IDropdownOption => {
            return { key: collection.id, text: collection.title };
          }),
        "text"
      )
    : [];

  const getCollectionById = (key: string | number) => {
    return (stacResponse.collections as IStacCollection[]).find(
      c => c.id === key.toString()
    );
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
