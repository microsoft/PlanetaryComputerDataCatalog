import {
  IStackStyles,
  Slider,
  Stack,
  getTheme,
  IconButton,
  IButtonStyles,
  FontSizes,
  ISliderStyles,
  Callout,
  DirectionalHint,
} from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import Feature from "components/Feature";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import {
  setCurrentEditingLayerId,
  setLayerOpacity,
} from "pages/Explore/state/mosaicSlice";
import { ILayerState } from "pages/Explore/types";
import { useState } from "react";
import { activeCmdButtonStyles, cmdButtonStyles } from "./LegendCmdBar";

interface LayerOptionsProps {
  layer: ILayerState;
}

export const OpacityCmdButton: React.FC<LayerOptionsProps> = ({
  layer,
  children,
}) => {
  const dispatch = useExploreDispatch();
  const [showOpacity, setShowOpacity] = useState<boolean>(false);
  const buttonId = useId("opacity-button");

  const handleChange = (value: number) => {
    const layerId = layer.layerId;
    layerId && dispatch(setLayerOpacity({ id: layerId, value }));
  };

  return (
    <>
      <IconButton
        id={buttonId}
        checked={showOpacity}
        title="Adjust layer opacity"
        aria-label={`Set ${layer.collection?.title} ${layer.renderOption?.name} opacity`}
        iconProps={{ iconName: "FluentBrightness" }}
        styles={
          layer.layer.opacity === 100 ? cmdButtonStyles : activeCmdButtonStyles
        }
        onClick={() => setShowOpacity(!showOpacity)}
      />
      {showOpacity && (
        <Callout
          target={`#${buttonId}`}
          gapSpace={5}
          isBeakVisible={false}
          directionalHint={DirectionalHint.topAutoEdge}
          onDismiss={() => setShowOpacity(false)}
          setInitialFocus
        >
          <Slider
            label="Layer opacity"
            aria-label="Layer opacity"
            min={0}
            max={100}
            step={1}
            value={layer.layer.opacity}
            onChange={handleChange}
            showValue={false}
            styles={sliderStyles}
          />
          {children}
        </Callout>
      )}
    </>
  );
};

const LayerOptions = ({ layer }: LayerOptionsProps) => {
  const dispatch = useExploreDispatch();
  const { currentEditingLayerId } = useExploreSelector(s => s.mosaic);
  const isEditing = layer.layerId === currentEditingLayerId;

  const handleEdit = () => {
    dispatch(setCurrentEditingLayerId(layer.layerId));
  };

  return (
    <Stack styles={optionsStyles}>
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

const sliderStyles: Partial<ISliderStyles> = {
  root: { width: 175, padding: 10 },
  titleLabel: { fontSize: FontSizes.size12 },
  activeSection: {
    background: theme.palette.themePrimary,
  },
  inactiveSection: {
    background: theme.palette.themeLighter,
  },
};
