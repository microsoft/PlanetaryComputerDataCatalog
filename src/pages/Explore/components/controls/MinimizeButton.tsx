import { IconButton, useTheme } from "@fluentui/react";
import { useCallback } from "react";
import { useExploreDispatch, useExploreSelector } from "../../state/hooks";
import { toggleShowSidebar } from "../../state/mapSlice";
import { SIDEBAR_WIDTH } from "../../utils/constants";

const MinimizeButton = () => {
  const dispatch = useExploreDispatch();
  const showSidebar = useExploreSelector(s => s.map.showSidebar);
  const theme = useTheme();
  const bgColor = theme.semanticColors.bodyBackground;

  const toggleSidebar = useCallback(() => {
    dispatch(toggleShowSidebar());
  }, [dispatch]);

  const direction = showSidebar ? "Left" : "Right";
  const title = showSidebar ? "Hide" : "Show";

  return (
    <div
      style={{
        position: "absolute",
        top: 140,
        left: showSidebar ? SIDEBAR_WIDTH + 10 : 0,
        zIndex: 1,
        padding: "8px 1px",
        borderRadius: "0  4px 4px 0",
        backgroundColor: bgColor,
        transition: "left .3s",
      }}
    >
      <IconButton
        onClick={toggleSidebar}
        iconProps={{ iconName: `Caret${direction}Solid8` }}
        styles={{
          root: { width: 20 },
          rootHovered: { backgroundColor: bgColor },
          rootFocused: { backgroundColor: bgColor },
          icon: { fontSize: 12, color: theme.palette.neutralTertiary },
          iconHovered: {
            backgroundColor: bgColor,
            color: theme.semanticColors.bodyText,
          },
        }}
        title={`${title} sidebar`}
        aria-label={`${title} sidebar`}
      />
    </div>
  );
};

export default MinimizeButton;
