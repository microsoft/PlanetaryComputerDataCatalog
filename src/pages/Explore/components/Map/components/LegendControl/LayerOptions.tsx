import { IStackStyles, Slider, Stack, Text } from "@fluentui/react";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setLayerOpacity } from "pages/Explore/state/mosaicSlice";
import { ILayerState } from "pages/Explore/types";

interface LayerOptionsProps {
  layer: ILayerState;
}

const LayerOptions = ({ layer }: LayerOptionsProps) => {
  const dispatch = useExploreDispatch();
  const handleChange = (value: number) => {
    const layerId = layer.layerId;
    layerId && dispatch(setLayerOpacity({ id: layerId, value }));
  };
  return (
    <Stack styles={optionsStyles}>
      <Stack horizontal horizontalAlign="end">
        <Text variant="small">Opacity: {layer.layer.opacity}%</Text>
      </Stack>
      <Slider
        aria-label="Layer opacity"
        min={0}
        max={100}
        step={1}
        value={layer.layer.opacity}
        onChange={handleChange}
        showValue={false}
        styles={{ root: { width: "100%" } }}
      />
    </Stack>
  );
};

export default LayerOptions;

const optionsStyles: IStackStyles = {
  root: {
    padding: "8px 0px",
  },
};
