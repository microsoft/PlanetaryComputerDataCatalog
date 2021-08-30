import { FontSizes, IconButton, TooltipHost, useTheme } from "@fluentui/react";
import { useId, useConst } from "@fluentui/react-hooks";
import { clearSelectedItem, setShowAsLayer } from "pages/Explore/state/detailSlice";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { useCallback } from "react";

const BackToListButton = () => {
  const theme = useTheme();
  const dispatch = useExploreDispatch();

  const tooltipId = useId("tooltip");
  const buttonId = useId("targetButton");

  const calloutProps = useConst({
    gapSpace: 0,
    target: `#${buttonId}`,
  });

  const label = "Return to results list";

  const handleClick = useCallback(() => {
    dispatch(clearSelectedItem());
    dispatch(setShowAsLayer(false));
  }, [dispatch]);

  return (
    <TooltipHost content={label} calloutProps={calloutProps}>
      <IconButton
        id={buttonId}
        onClick={handleClick}
        iconProps={{ iconName: "Back" }}
        ariaLabel={label}
        aria-describedby={tooltipId}
        styles={{
          icon: {
            fontSize: FontSizes.size24,
            color: theme.palette.themeDarkAlt,
          },
          root: {
            position: "absolute",
            zIndex: 1,
            width: 40,
            height: 40,
            margin: 6,
            backgroundColor: theme.semanticColors.bodyBackground,
            boxShadow: theme.effects.elevation4,
          },
        }}
      />
    </TooltipHost>
  );
};

export default BackToListButton;
