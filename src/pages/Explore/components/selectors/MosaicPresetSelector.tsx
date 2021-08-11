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
          return { key: mosaic.key, text: mosaic.name };
        })
      : [];

  return (
    <StateSelector
      title="Select mosaic preset"
      icon="Nav2DMapView"
      action={ActionTypes.mosaic}
      options={mosaicOptions}
      selectedKey={state.mosaicPresetId}
      disabled={!state?.collection?.id}
    />
  );
};

export default MosaicPresetSelector;
