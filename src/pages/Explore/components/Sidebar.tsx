import { IStackTokens, Stack, StackItem } from "@fluentui/react";

import CollectionSelector from "./selectors/CollectionSelector";
import MosaicPane from "./panes/MosaicPane";
import CollectionDetailPane from "./panes/CollectionDetailPane";
import TemporarySearch from "./TemporarySearch";
import MinimizeButton from "./controls/MinimizeButton";
import { useExploreSelector } from "../state/hooks";
import { SIDEBAR_WIDTH } from "../utils/constants";

const stackTokens: IStackTokens = {
  childrenGap: 5,
};

const Sidebar = () => {
  const showSidebar = useExploreSelector(s => s.map.showSidebar);
  const width = showSidebar ? SIDEBAR_WIDTH : 0;
  const visibility = showSidebar ? "visibile" : "hidden";
  const margin = showSidebar ? 5 : 3;

  return (
    <>
      <StackItem
        disableShrink
        styles={{
          root: {
            margin: margin,
            width: width,
            visibility: visibility,
            transition: "width 0.3s",
          },
        }}
      >
        <Stack styles={{ root: { height: "100%" } }} tokens={stackTokens}>
          <p>Explore Planetary Computer datasets. Explains filters and results.</p>
          <CollectionSelector />
          <MosaicPane />
          <CollectionDetailPane />
          <TemporarySearch />
        </Stack>
      </StackItem>
      <MinimizeButton />
    </>
  );
};

export default Sidebar;
