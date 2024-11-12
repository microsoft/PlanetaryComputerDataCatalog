import {
  Slider,
  getTheme,
  IconButton,
  FontSizes,
  ISliderStyles,
  Callout,
  DirectionalHint,
} from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setLayerOpacity } from "pages/Explore/state/mosaicSlice";
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
        iconProps={{ iconName: "CircleHalfFull" }}
        role="menuitem"
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

const theme = getTheme();

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
