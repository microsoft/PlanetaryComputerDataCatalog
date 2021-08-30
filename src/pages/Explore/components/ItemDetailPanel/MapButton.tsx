import { FontSizes, IconButton, TooltipHost, useTheme } from "@fluentui/react";
import { useId, useConst } from "@fluentui/react-hooks";
import { setShowAsLayer } from "pages/Explore/state/detailSlice";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { useCallback } from "react";

const MapButton = () => {
  const theme = useTheme();
  const dispatch = useExploreDispatch();
  const showAsLayer = useExploreSelector(s => s.detail.showAsLayer);

  const tooltipId = useId("tooltip");
  const buttonId = useId("targetButton");
  const label = showAsLayer
    ? "Remove this item from the map"
    : "View this item on the map";

  const calloutProps = useConst({
    gapSpace: 0,
    target: `#${buttonId}`,
  });

  const handleClick = useCallback(() => {
    dispatch(setShowAsLayer(!showAsLayer));
  }, [dispatch, showAsLayer]);

  return (
    <TooltipHost content={label} calloutProps={calloutProps}>
      <IconButton
        id={buttonId}
        onClick={handleClick}
        checked={showAsLayer}
        iconProps={{ iconName: "Nav2DMapView" }}
        ariaLabel={label}
        aria-describedby={tooltipId}
        styles={{
          icon: {
            fontSize: FontSizes.size24,
          },
          iconChecked: {
            color: theme.semanticColors.bodyBackground,
          },
          rootChecked: {
            backgroundColor: theme.palette.accent,
            borderColor: theme.palette.neutralLight,
          },
          rootCheckedHovered: {
            backgroundColor: theme.palette.themeSecondary,
          },
          root: {
            float: "right",
            top: -32,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.semanticColors.bodyBackground,
            border: "1px solid",
            borderColor: theme.palette.themePrimary,
          },
        }}
      />
    </TooltipHost>
  );
};

export default MapButton;
