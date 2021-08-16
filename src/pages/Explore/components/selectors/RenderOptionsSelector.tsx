import { useContext } from "react";
import { ExploreContext } from "../state";
import { ActionTypes } from "../state/reducers";
import { IDropdownOption } from "@fluentui/react";
import { useCollectionMosaicInfo } from "utils/requests";
import StateSelector from "./StateSelector";

const RenderOptionsSelector = () => {
  const { state } = useContext(ExploreContext);
  const { collection, queryName } = state;

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
      action={ActionTypes.renderOptions}
      options={options}
      selectedKey={state.renderOptions}
      disabled={!state.queryName}
    />
  );
};
export default RenderOptionsSelector;
