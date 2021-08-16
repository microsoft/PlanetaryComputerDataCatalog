import { IDropdownOption } from "@fluentui/react";
import { useCollectionMosaicInfo } from "utils/requests";
import { useExploreSelector } from "../state/hooks";
import { setMosaicQuery } from "../state/mosaicSlice";
import StateSelector from "./StateSelector";

const MosaicPresetSelector = () => {
  const { collection, query } = useExploreSelector(state => state.mosaic);

  const { isSuccess, data: mosaicInfo } = useCollectionMosaicInfo(collection?.id);

  const mosaicOptions =
    isSuccess && mosaicInfo?.mosaics
      ? mosaicInfo.mosaics.map((mosaic: any): IDropdownOption => {
          return { key: mosaic.name, text: mosaic.name };
        })
      : [];

  const getQueryPresetByName = (key: string | number) => {
    return mosaicInfo.mosaics.find((m: any) => m.name === key);
  };

  return (
    <StateSelector
      title="Select query preset"
      icon="Nav2DMapView"
      action={setMosaicQuery}
      options={mosaicOptions}
      selectedKey={query.name}
      getStateValFn={getQueryPresetByName}
      disabled={!collection?.id}
    />
  );
};

export default MosaicPresetSelector;
