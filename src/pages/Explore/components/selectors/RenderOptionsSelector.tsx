import { IDropdownOption } from "@fluentui/react";
import { useCollectionMosaicInfo } from "utils/requests";
import StateSelector from "./StateSelector";
import { setRenderOptions } from "../state/mosaicSlice";
import { useExploreSelector } from "../state/hooks";

const RenderOptionsSelector = () => {
  const { collection, queryName, renderOptions } = useExploreSelector(
    state => state.mosaic
  );

  const { data: mosaicInfo } = useCollectionMosaicInfo(collection?.id);

  const renderers =
    mosaicInfo?.mosaics && queryName
      ? mosaicInfo?.mosaics.find((mosaic: any) => mosaic.name === queryName)
          .renderers
      : null;

  const options = renderers
    ? renderers.map((renderer: any): IDropdownOption => {
        return { key: renderer.name, text: renderer.name };
      })
    : [];

  return (
    <StateSelector
      title="Select render presets"
      icon="MapLayers"
      action={setRenderOptions}
      options={options}
      selectedKey={renderOptions}
      disabled={!queryName}
    />
  );
};
export default RenderOptionsSelector;
