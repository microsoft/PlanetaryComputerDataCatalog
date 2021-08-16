import { IDropdownOption } from "@fluentui/react";
import { useCollectionMosaicInfo } from "utils/requests";
import StateSelector from "./StateSelector";
import { setRenderOptions } from "../state/mosaicSlice";
import { useExploreSelector } from "../state/hooks";

const RenderOptionsSelector = () => {
  const { collection, query, renderOptions } = useExploreSelector(
    state => state.mosaic
  );

  const { data: mosaicInfo } = useCollectionMosaicInfo(collection?.id);

  const renderers =
    mosaicInfo?.mosaics && query.name
      ? mosaicInfo.mosaics.find((mosaic: any) => mosaic.name === query.name)
          .renderOptions || []
      : [];

  const options = renderers.map((renderer: any): IDropdownOption => {
    return { key: renderer.name, text: renderer.name };
  });

  return (
    <StateSelector
      title="Select render presets"
      icon="MapLayers"
      action={setRenderOptions}
      options={options}
      selectedKey={renderOptions}
      disabled={!query.name}
    />
  );
};
export default RenderOptionsSelector;
