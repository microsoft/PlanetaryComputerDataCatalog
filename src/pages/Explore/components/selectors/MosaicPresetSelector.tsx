import { IDropdownOption } from "@fluentui/react";
import { useCollectionMosaicInfo } from "utils/requests";
import { useExploreSelector } from "../state/hooks";
import { setQueryName } from "../state/mosaicSlice";
import StateSelector from "./StateSelector";

const MosaicPresetSelector = () => {
  const { collection, queryName } = useExploreSelector(state => state.mosaic);

  const { isSuccess, data: mosaicInfo } = useCollectionMosaicInfo(collection?.id);

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
      action={setQueryName}
      options={mosaicOptions}
      selectedKey={queryName}
      disabled={!collection?.id}
    />
  );
};

export default MosaicPresetSelector;
