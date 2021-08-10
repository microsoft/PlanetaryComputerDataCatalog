import { useContext } from "react";
import { ActionTypes } from "./state/reducers";
import { ExploreContext } from "./state";
import { Dropdown, IDropdownOption } from "@fluentui/react";
import { useCollections } from "utils/requests";
import { renderPlaceholder, renderTitle } from "../utils";
import { IStacCollection } from "types/stac";

const CollectionSelector = () => {
  const { dispatch } = useContext(ExploreContext);
  const { isSuccess, data: stacResponse } = useCollections();

  const collectionOptions = isSuccess
    ? (stacResponse?.collections as IStacCollection[])
        .filter(collection => !("cube:variables" in collection))
        .map((collection): IDropdownOption => {
          return { key: collection.id, text: collection.title };
        })
    : [];

  const handleCollectionChange = (
    _: any,
    option: IDropdownOption | undefined
  ): void => {
    if (option) {
      dispatch({
        type: ActionTypes.dataset,
        payload: option.key,
      });
    }
  };

  return (
    <div>
      <Dropdown
        options={collectionOptions}
        onChange={handleCollectionChange}
        onRenderTitle={renderTitle("AddOnlineMeeting")}
        onRenderPlaceholder={renderPlaceholder("AddOnlineMeeting", "Select dataset")}
        ariaLabel="Selected dataset"
      />
    </div>
  );
};

export default CollectionSelector;
