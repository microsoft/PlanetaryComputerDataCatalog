import { useContext } from "react";
import { ActionTypes } from "../state/reducers";
import { ExploreContext } from "../state";
import { IDropdownOption } from "@fluentui/react";
import { useCollectionMosaicInfo } from "utils/requests";
import StateSelector from "./StateSelector";

const MosaicPresetSelector = () => {
  const { state } = useContext(ExploreContext);
  const { isSuccess, data: mosaicInfo } = useCollectionMosaicInfo(
    state?.collection?.id
  );

  const mosaicOptions =
    isSuccess && mosaicInfo?.mosaics
      ? mosaicInfo.mosaics.map((mosaic: any): IDropdownOption => {
          return { key: mosaic.name, text: mosaic.name };
        })
      : [];

  return (
    <StateSelector
      title="Select query preset"
      icon="Nav2DMapView"
      action={ActionTypes.queryOptions}
      options={mosaicOptions}
      selectedKey={state.queryName}
      disabled={!state?.collection?.id}
    />
  );
};

export default MosaicPresetSelector;
