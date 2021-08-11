import { useContext } from "react";
import { ExploreContext } from "../state";
import { ActionTypes } from "../state/reducers";
import { IDropdownOption } from "@fluentui/react";
import { useCollectionMosaicInfo } from "utils/requests";
import StateSelector from "./StateSelector";

const RenderOptionsSelector = () => {
  const { state } = useContext(ExploreContext);
  const { collection, mosaicPresetId } = state;

  const { data: mosaicInfo } = useCollectionMosaicInfo(collection?.id);

  const renderers =
    mosaicInfo?.mosaics && mosaicPresetId
      ? mosaicInfo?.mosaics.find((mosaic: any) => mosaic.key === mosaicPresetId)
          .renderers
      : null;

  const options = renderers
    ? renderers.flatMap((renderer: string): IDropdownOption => {
        const renderOpts = mosaicInfo.renderOptions[renderer];

        return renderOpts.map((opt: any) => ({ key: opt.key, text: opt.name }));
      })
    : [];

  return (
    <StateSelector
      title="Select render options"
      icon="MapLayers"
      action={ActionTypes.bands}
      options={options}
      selectedKey={state.bandsPresetId}
      disabled={!state.mosaicPresetId}
    />
  );
};
export default RenderOptionsSelector;
