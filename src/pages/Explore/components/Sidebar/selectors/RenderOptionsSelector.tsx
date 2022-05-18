import { useEffect } from "react";
import { IDropdownOption } from "@fluentui/react";

import { useCollectionMosaicInfo } from "../../../utils/hooks";
import { selectCurrentMosaic, setRenderOption } from "../../../state/mosaicSlice";
import { useExploreDispatch, useExploreSelector } from "../../../state/hooks";
import StateSelector from "./StateSelector";
import useCqlPropertyMatcher from "./hooks/useCqlPropertyMatcher";
import { every } from "lodash-es";

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

  const matcher = useCqlPropertyMatcher();
  const options = renderers.map((renderer): IDropdownOption => {
    const enabled = every(
      renderer.conditions?.map(condition =>
        matcher(condition.property, condition.value)
      )
    );
    return { key: renderer.name, text: renderer.name, disabled: !enabled };
  });

  const getOptionByName = (key: string | number) => {
    return mosaicInfo?.renderOptions?.find(mosaic => mosaic.name === key);
  };

  // If the currently selected option is now disabled, move to the first
  // non-disabled option
  const enabledSelectedKey = options.find(
    option => option.key === renderOption?.name
  )?.disabled
    ? options.find(option => !option.disabled)?.key
    : renderOption?.name;

  if (enabledSelectedKey !== renderOption?.name) {
    if (enabledSelectedKey) {
      const newOption = getOptionByName(enabledSelectedKey);
      newOption && dispatch(setRenderOption(newOption));
    }
  }
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
