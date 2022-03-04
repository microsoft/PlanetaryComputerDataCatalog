import {
  IStackStyles,
  Slider,
  Stack,
  StackItem,
  Text,
  getTheme,
  IconButton,
  IButtonStyles,
  FontSizes,
} from "@fluentui/react";
import Feature from "components/Feature";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import {
  setCurrentEditingLayerId,
  setLayerOpacity,
} from "pages/Explore/state/mosaicSlice";
import { ILayerState } from "pages/Explore/types";

interface LayerOptionsProps {
  layer: ILayerState;
}

const LayerOptions = ({ layer }: LayerOptionsProps) => {
  const dispatch = useExploreDispatch();
  const { currentEditingLayerId } = useExploreSelector(s => s.mosaic);
  const isEditing = layer.layerId === currentEditingLayerId;

  const handleChange = (value: number) => {
    const layerId = layer.layerId;
    layerId && dispatch(setLayerOpacity({ id: layerId, value }));
  };

  const handleEdit = () => {
    dispatch(setCurrentEditingLayerId(layer.layerId));
  };

  return (
    <Stack styles={optionsStyles}>
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
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
      <Feature name="pin">
        <Stack horizontal tokens={{ childrenGap: 6 }}>
          <IconButton
            disabled={isEditing && !layer.isPinned}
            iconProps={{ iconName: "Edit" }}
            onClick={handleEdit}
            title={
              isEditing
                ? "Stop editing and re-pin the layer"
                : "Load layer to sidebar"
            }
            styles={buttonStyles}
          />
        </Stack>
      </Feature>
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

const buttonStyles: IButtonStyles = {
  root: {
    width: 18,
    height: 18,
  },
  icon: {
    color: theme.semanticColors.bodyText,
    fontSize: FontSizes.small,
    width: 18,
  },
};
