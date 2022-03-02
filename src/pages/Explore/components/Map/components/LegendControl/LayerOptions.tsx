import {
  IStackStyles,
  Slider,
  Stack,
  StackItem,
  Text,
  getTheme,
} from "@fluentui/react";
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
    <Stack horizontal styles={optionsStyles} tokens={{ childrenGap: 6 }}>
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
      <StackItem shrink={false}>
        <Text variant="small">Opacity: {layer.layer.opacity}%</Text>
      </StackItem>
    </Stack>
  );
};

export default LayerOptions;

const theme = getTheme();
const optionsStyles: IStackStyles = {
  root: {
    padding: "4px 4px 4px 0",
    backgroundColor: theme.palette.neutralLighterAlt,
    borderRadius: 4,
  },
};
