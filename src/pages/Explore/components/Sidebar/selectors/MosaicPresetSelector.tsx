import { IDropdownOption } from "@fluentui/react";
import { useEffect } from "react";
import { useCollectionMosaicInfo } from "../../../utils/hooks";
import { useExploreDispatch, useExploreSelector } from "../../../state/hooks";
import { selectCurrentMosaic, setMosaicQuery } from "../../../state/mosaicSlice";
import StateSelector from "./StateSelector";
import { useMosaicUrlState } from "./hooks/useUrlState";

const MosaicPresetSelector = () => {
  const { collection, query, isCustomQuery } =
    useExploreSelector(selectCurrentMosaic);
  const dispatch = useExploreDispatch();

  const { isSuccess, data: mosaicInfo } = useCollectionMosaicInfo(collection?.id);

  useEffect(() => {
    if (mosaicInfo && query.name === null) {
      dispatch(setMosaicQuery(mosaicInfo.mosaics[0]));
    }
  }, [dispatch, mosaicInfo, query.name]);

  useMosaicUrlState(mosaicInfo?.mosaics);

  const mosaicOptions =
    isSuccess && mosaicInfo?.mosaics
      ? mosaicInfo.mosaics.map((mosaic): IDropdownOption => {
          return { key: mosaic.name || "", text: mosaic.name || "" };
        })
      : [];

  const getQueryPresetByName = (key: string | number) => {
    return mosaicInfo?.mosaics.find(mosaic => mosaic.name === key);
  };

  return (
    <StateSelector
      title="Select a preset filter to find data"
      icon="FluentFilter"
      action={setMosaicQuery}
      options={mosaicOptions}
      selectedKey={query.name}
      getStateValFn={getQueryPresetByName}
      disabled={!collection?.id || isCustomQuery}
      cyId="mosaic-selector"
    />
  );
};

export default MosaicPresetSelector;
