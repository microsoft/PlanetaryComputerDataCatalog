import { useEffect, useMemo } from "react";
import { IStackStyles, Stack, StackItem } from "@fluentui/react";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { resetMosaic } from "pages/Explore/state/mosaicSlice";
import { resetDetail } from "pages/Explore/state/detailSlice";
import MinimizeButton from "../controls/ToggleSidebarButton";
import AnimationExporter from "./exporters/AnimationExporter";
import { CollectionItemFilter } from "./CollectionItemFilter/CollectionItemFilter";
import ImageExporter from "./exporters/ImageExporter";
import { SidebarPanels } from "pages/Explore/enums";
import Chat from "./Chat";
import { AnimationPlayedProvider } from "./Chat/components/context/AnimationPlayedContext";

export const Sidebar = () => {
  const dispatch = useExploreDispatch();
  const { showSidebar: isSidebarVisible, sidebarWidth } = useExploreSelector(
    s => s.map
  );
  const { showSelectedItemAsLayer: isItemLayerVisible } = useExploreSelector(
    s => s.detail.display
  );
  const { sidebarPanel } = useExploreSelector(s => s.map);

  const { width, sidebarVisibility } = useMemo(() => {
    return {
      width: isSidebarVisible ? sidebarWidth : 0,
      sidebarVisibility: isSidebarVisible ? "visible" : "hidden",
    };
  }, [isSidebarVisible, sidebarWidth]);

  useEffect(() => {
    return () => {
      // When Explore unmounts, reset the mosaic state so it's fresh when the
      // user navigates back
      dispatch(resetMosaic());
      dispatch(resetDetail());
    };
  }, [dispatch]);

  const sidebarStyles: Partial<IStackStyles> = {
    root: {
      width: width,
      visibility: sidebarVisibility,
      transition: "width 0.3s",
      minWidth: 8,
    },
  };

  // Classes used to sync state via responsive media queries in css
  let visibilityClass =
    !isSidebarVisible || isItemLayerVisible ? "explorer-sidebar-hidden" : "";

  const registeredPanels = {
    [SidebarPanels.itemSearch]: (
      <CollectionItemFilter sidebarVisibility={sidebarVisibility} />
    ),
    [SidebarPanels.animation]: <AnimationExporter />,
    [SidebarPanels.image]: <ImageExporter />,
    [SidebarPanels.chat]: <Chat />,
  };

  return (
    <>
      <StackItem
        styles={sidebarStyles}
        className={`explorer-sidebar ${visibilityClass}`}
      >
        <AnimationPlayedProvider>
          <Stack id="explorer-sidebar-content" styles={sidebarStackStyles}>
            {registeredPanels[sidebarPanel]}
          </Stack>
        </AnimationPlayedProvider>
      </StackItem>
      <MinimizeButton />
    </>
  );
};

const sidebarStackStyles: Partial<IStackStyles> = {
  root: {
    height: "100%",
  },
};
