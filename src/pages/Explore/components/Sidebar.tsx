import {
  IStackStyles,
  IStackTokens,
  Separator,
  Stack,
  StackItem,
  Text,
} from "@fluentui/react";

import { CollectionSelector } from "./selectors";
import MosaicPane from "./panes/MosaicPane";
import MinimizeButton from "./controls/MinimizeButton";
import ItemDetailPanel from "./ItemDetailPanel";
import SearchResultsPane from "./panes/SearchResultsPane";
import { useStacFilter } from "../utils/hooks";
import { SIDEBAR_WIDTH } from "../utils/constants";
import { useExploreSelector } from "../state/hooks";

const stackTokens: IStackTokens = {
  childrenGap: 5,
};

const Sidebar = () => {
  const showSidebar = useExploreSelector(s => s.map.showSidebar);
  const width = showSidebar ? SIDEBAR_WIDTH : 0;
  const sidebarVisibility = showSidebar ? "visibile" : "hidden";
  const margin = showSidebar ? 5 : 3;

  const selectedItem = useExploreSelector(s => s.detail.selectedItem);
  const searchPanelDisplay = selectedItem ? "none" : "flex";
  const detailViewDisplay = selectedItem ? "flex" : "none";

  const stacFilter = useStacFilter();
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
      visibility: sidebarVisibility,
      display: searchPanelDisplay,
      transition: "visibility 0.1s",
    },
  };

  const itemDetailPanelStyles: Partial<IStackStyles> = {
    root: {
      height: "100%",
      display: detailViewDisplay,
    },
  };

  return (
    <>
      <StackItem disableShrink styles={sidebarStyles}>
        <Stack styles={searchPanelStyles} tokens={stackTokens}>
          <Text styles={{ root: { padding: "5px 0" } }} block>
            Explore Planetary Computer datasets. Explains filters and results.
          </Text>
          <CollectionSelector />
          <MosaicPane />
          <Separator />
          <SearchResultsPane request={stacFilter} />
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
