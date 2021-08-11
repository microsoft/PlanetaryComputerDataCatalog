import { IDropdownOption } from "@fluentui/react";

import { useContext } from "react";
import { ExploreContext } from "../state";
import { ActionTypes } from "../state/reducers";
import { useCollections } from "utils/requests";
import { IStacCollection } from "types/stac";
import StateSelector from "./StateSelector";

const CollectionSelector = () => {
  const { isSuccess, data: stacResponse } = useCollections();
  const { state } = useContext(ExploreContext);

  const collectionOptions = isSuccess
    ? (stacResponse?.collections as IStacCollection[])
        .filter(collection => !("cube:variables" in collection))
        .map((collection): IDropdownOption => {
          return { key: collection.id, text: collection.title };
        })
    : [];

  return (
    <StateSelector
      title="Select a dataset"
      icon="World"
      action={ActionTypes.dataset}
      options={collectionOptions}
      selectedKey={state.selectedDataset}
    />
  );
};

export default CollectionSelector;
