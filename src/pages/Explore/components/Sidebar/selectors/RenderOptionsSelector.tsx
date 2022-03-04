import { useEffect } from "react";
import { IDropdownOption } from "@fluentui/react";

import { useCollectionMosaicInfo } from "../../../utils/hooks";
import { selectCurrentMosaic, setRenderOption } from "../../../state/mosaicSlice";
import { useExploreDispatch, useExploreSelector } from "../../../state/hooks";
import StateSelector from "./StateSelector";

const RenderOptionsSelector = () => {
  const dispatch = useExploreDispatch();
  const { collection, renderOption } = useExploreSelector(selectCurrentMosaic);
  const { data: mosaicInfo } = useCollectionMosaicInfo(collection?.id);

  // Set a default render option if none is selected
  useEffect(() => {
    if (mosaicInfo?.renderOptions && renderOption === null) {
      dispatch(setRenderOption(mosaicInfo.renderOptions[0]));
    }
  }, [dispatch, mosaicInfo, renderOption]);

  const renderers = mosaicInfo?.renderOptions ?? [];

  const options = renderers.map((renderer): IDropdownOption => {
    return { key: renderer.name, text: renderer.name };
  });

  const getOptionByName = (key: string | number) => {
    return mosaicInfo?.renderOptions?.find(mosaic => mosaic.name === key);
  };

  return (
    <StateSelector
      title="Select a rendering option"
      icon="Layer"
      action={setRenderOption}
      options={options}
      selectedKey={renderOption?.name}
      getStateValFn={getOptionByName}
      disabled={!Boolean(mosaicInfo?.renderOptions)}
      cyId="render-selector"
    />
  );
};
export default RenderOptionsSelector;
