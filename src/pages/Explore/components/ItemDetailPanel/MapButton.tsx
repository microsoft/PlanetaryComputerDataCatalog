import { IconButton, TooltipHost } from "@fluentui/react";
import { useId, useConst } from "@fluentui/react-hooks";
import { setShowAsLayer } from "pages/Explore/state/detailSlice";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { useCallback } from "react";
import { checkedHeaderButtonStyle } from "./styles";

const MapButton = () => {
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
        styles={checkedHeaderButtonStyle}
      />
    </TooltipHost>
  );
};

export default MapButton;
