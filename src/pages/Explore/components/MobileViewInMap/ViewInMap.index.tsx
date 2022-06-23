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
  const { showSidebar } = useExploreSelector(s => s.map);
  const handleClick = () => {
    dispatch(toggleShowSidebar());
  };

  if (showSidebar) return null;

  return (
    <PrimaryButton
      className="explorer-mobile-view-sidebar"
      styles={backToSidebarStyles}
      onClick={handleClick}
      iconProps={sidebarIconProps}
    >
      View Search
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
