import { MosaicPresetSelector, RenderOptionsSelector } from "../selectors";
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
