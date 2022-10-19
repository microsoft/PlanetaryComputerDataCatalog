import { ActionButton, FontSizes, useTheme } from "@fluentui/react";
import { clearDetailView } from "pages/Explore/state/detailSlice";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { restorePreviousCenterAndZoom } from "pages/Explore/state/mapSlice";
import { useCallback } from "react";

const BackToListButton = () => {
  const theme = useTheme();
  const dispatch = useExploreDispatch();
  const { previewMode } = useExploreSelector(s => s.detail);

  const label = "Return to results list";

  const handleClick = useCallback(() => {
    dispatch(clearDetailView());

    if (!previewMode.enabled) {
      dispatch(restorePreviousCenterAndZoom());
    }
  }, [dispatch, previewMode.enabled]);

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
