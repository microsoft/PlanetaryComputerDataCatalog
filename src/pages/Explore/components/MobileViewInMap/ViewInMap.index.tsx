import { IButtonStyles, PrimaryButton, Stack } from "@fluentui/react";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { toggleShowSidebar } from "pages/Explore/state/mapSlice";
import { sidebarBottomButtonStyles } from "../ExploreInHub";

export const MobileViewMapButton = () => {
  const dispatch = useExploreDispatch();
  const handleClick = () => {
    dispatch(toggleShowSidebar());
  };

  return (
    <Stack className="explorer-mobile-view-map" styles={sidebarBottomButtonStyles}>
      <PrimaryButton
        styles={mapViewStyles}
        onClick={handleClick}
        iconProps={mapIconProps}
      >
        View map
      </PrimaryButton>
    </Stack>
  );
};

export const MobileViewSidebarButton = () => {
  const dispatch = useExploreDispatch();
  const { showSidebar, sidebarPanel } = useExploreSelector(s => s.map);
  const { previewMode } = useExploreSelector(s => s.detail);

  const handleClick = () => {
    dispatch(toggleShowSidebar());
  };

  if (showSidebar || previewMode.enabled) return null;

  const panelText = ["animation", "image"].includes(sidebarPanel)
    ? "Config"
    : "Search";
  return (
    <PrimaryButton
      className="explorer-mobile-view-sidebar"
      styles={backToSidebarStyles}
      onClick={handleClick}
      iconProps={sidebarIconProps}
    >
      View {panelText}
    </PrimaryButton>
  );
};

const sidebarIconProps = { iconName: "ChevronLeft" };
const backToSidebarStyles: IButtonStyles = {
  root: {
    position: "absolute",
    bottom: 10,
    left: 10,
    zIndex: 1,
    border: "1px solid darkgray",
  },
};

const mapViewStyles = { root: { margin: "auto", display: "block" } };
const mapIconProps = { iconName: "Nav2DMapView" };
