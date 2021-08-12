import { IDropdownOption } from "@fluentui/react";
import { sortBy } from "lodash-es";

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
      action={ActionTypes.collection}
      options={collectionOptions}
      selectedKey={state?.collection?.id}
      getStateValFn={getCollectionById}
    />
  );
};

export default CollectionSelector;
