import { ActionButton, FontSizes, useTheme } from "@fluentui/react";
import { clearSelectedItem, setShowAsLayer } from "pages/Explore/state/detailSlice";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { useCallback } from "react";

const BackToListButton = () => {
  const theme = useTheme();
  const dispatch = useExploreDispatch();

  const label = "Return to results list";

  const handleClick = useCallback(() => {
    dispatch(clearSelectedItem());
    dispatch(setShowAsLayer(false));
  }, [dispatch]);

  return (
    <ActionButton
      onClick={handleClick}
      iconProps={{ iconName: "Back" }}
      ariaLabel={label}
      styles={{
        icon: {
          fontSize: FontSizes.size16,
          color: theme.palette.themeDarkAlt,
        },
        root: {
          position: "absolute",
          zIndex: 1,
          height: 40,
          margin: 8,
          backgroundColor: theme.semanticColors.bodyBackground,
          boxShadow: theme.effects.elevation4,
        },
      }}
      data-cy="back-to-list"
    >
      Back to results
    </ActionButton>
  );
};

export default BackToListButton;
