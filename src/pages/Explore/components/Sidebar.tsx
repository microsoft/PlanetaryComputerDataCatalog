import { IStackStyles, IStackTokens, Stack, StackItem } from "@fluentui/react";

import CollectionSelector from "./selectors/CollectionSelector";
import MosaicPane from "./panes/MosaicPane";
import CollectionDetailPane from "./panes/CollectionDetailPane";
import TemporarySearch from "./TemporarySearch";
import MinimizeButton from "./controls/MinimizeButton";
import { useExploreSelector } from "../state/hooks";
import { SIDEBAR_WIDTH } from "../utils/constants";
import ItemDetailPanel from "./ItemDetailPanel";

const stackTokens: IStackTokens = {
  childrenGap: 5,
};

const Sidebar = () => {
  const showSidebar = useExploreSelector(s => s.map.showSidebar);
  const width = showSidebar ? SIDEBAR_WIDTH : 0;
  const sidebarVisibility = showSidebar ? "visibile" : "hidden";
  const margin = showSidebar ? 5 : 3;

  const selectedItem = useExploreSelector(s => s.detail.selectedItem);
  const searchPaneVisibility = selectedItem ? "hidden" : "visible";

  const sidebarStyles: Partial<IStackStyles> = {
    root: {
      width: width,
      margin: margin,
      visibility: sidebarVisibility,
      transition: "width 0.3s",
    },
  };

  const searchPanelStyles: Partial<IStackStyles> = {
    root: {
      height: "100%",
      visibility: searchPaneVisibility,
      transition: "visibility 0.3s",
      display: selectedItem ? "none" : "flex",
    },
  };

  const itemDetailPanelStyles: Partial<IStackStyles> = {
    root: { height: "100%", display: selectedItem ? "flex" : "none" },
  };

  return (
    <>
      <StackItem disableShrink styles={sidebarStyles}>
        <Stack styles={searchPanelStyles} tokens={stackTokens}>
          <p>Explore Planetary Computer datasets. Explains filters and results.</p>
          <CollectionSelector />
          <MosaicPane />
          <CollectionDetailPane />
          <TemporarySearch />
        </Stack>
        <Stack styles={itemDetailPanelStyles} tokens={stackTokens}>
          <ItemDetailPanel />
        </Stack>
      </StackItem>
      <MinimizeButton />
    </>
  );
};

export default Sidebar;
