import { IDropdownOption } from "@fluentui/react";

import StateSelector from "./StateSelector";
import { useCollectionMosaicInfo } from "utils/requests";
import { setRenderOption } from "../../state/mosaicSlice";
import { useExploreSelector } from "../../state/hooks";
import { IMosaic } from "types";

const RenderOptionsSelector = () => {
  const {
    collection,
    query,
    renderOption: renderOptions,
  } = useExploreSelector(state => state.mosaic);

  const { data } = useCollectionMosaicInfo(collection?.id);
  const mosaics: IMosaic[] = data?.mosaics;

  const renderers =
    mosaics && query.name
      ? mosaics.find(mosaic => mosaic.name === query.name)?.renderOptions || []
      : [];

  const options = renderers.map((renderer): IDropdownOption => {
    return { key: renderer.name, text: renderer.name };
  });

  return (
    <StateSelector
      title="Select render presets"
      icon="MapLayers"
      action={setRenderOption}
      options={options}
      selectedKey={renderOptions?.name}
      disabled={!query.name}
    />
  );
};
export default RenderOptionsSelector;
