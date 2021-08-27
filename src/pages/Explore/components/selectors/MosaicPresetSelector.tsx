import { IDropdownOption } from "@fluentui/react";
import { useEffect } from "react";
import { IMosaicInfo } from "types";
import { useCollectionMosaicInfo } from "utils/requests";
import { useExploreDispatch, useExploreSelector } from "../../state/hooks";
import { setMosaicQuery } from "../../state/mosaicSlice";
import StateSelector from "./StateSelector";

const MosaicPresetSelector = () => {
  const { collection, query } = useExploreSelector(state => state.mosaic);
  const dispatch = useExploreDispatch();

  const { isSuccess, data } = useCollectionMosaicInfo(collection?.id);
  const mosaicInfo: IMosaicInfo = data;

  useEffect(() => {
    if (mosaicInfo && query.name === null) {
      dispatch(setMosaicQuery(mosaicInfo.mosaics[0]));
    }
  }, [dispatch, mosaicInfo, query.name]);

  const mosaicOptions =
    isSuccess && mosaicInfo?.mosaics
      ? mosaicInfo.mosaics.map((mosaic): IDropdownOption => {
          return { key: mosaic.name || "", text: mosaic.name || "" };
        })
      : [];

  const getQueryPresetByName = (key: string | number) => {
    return mosaicInfo.mosaics.find(mosaic => mosaic.name === key);
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
