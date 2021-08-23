import MosaicPresetSelector from "../selectors/MosaicPresetSelector";
import RenderOptionsSelector from "../selectors/RenderOptionsSelector";
import OptionsPane from "./OptionsPane";

const MosaicPane = () => {
  return (
    <>
      <MosaicPresetSelector />
      <RenderOptionsSelector />
      <OptionsPane />
    </>
  );
};

export default MosaicPane;
