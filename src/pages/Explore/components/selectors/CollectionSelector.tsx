import { ActionTypes } from "../state/reducers";
import { IDropdownOption } from "@fluentui/react";
import { useCollections } from "utils/requests";
import { IStacCollection } from "types/stac";
import StateSelector from "./StateSelector";

const CollectionSelector = () => {
  const { isSuccess, data: stacResponse } = useCollections();

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
      icon="AddOnlineMeeting"
      action={ActionTypes.dataset}
      options={collectionOptions}
    />
  );
};

export default CollectionSelector;
