import { useContext } from "react";
import { ActionTypes } from "../state/reducers";
import { ExploreContext } from "../state";
import { IDropdownOption } from "@fluentui/react";
import { useCollectionMosaicInfo } from "utils/requests";
import StateSelector from "./StateSelector";

const MosaicPresetSelector = () => {
  const { state } = useContext(ExploreContext);
  const { isSuccess, data: mosaicInfo } = useCollectionMosaicInfo(
    state.selectedDataset
  );

  const mosaicOptions =
    isSuccess && mosaicInfo?.mosaics
      ? mosaicInfo.mosaics.map((mosaic: any): IDropdownOption => {
          return { key: mosaic.key, text: mosaic.name };
        })
      : [];

  return (
    <StateSelector
      title="Mosaic preset"
      icon="Sqaure"
      action={ActionTypes.mosaic}
      options={mosaicOptions}
    />
  );
};
export default MosaicPresetSelector;
