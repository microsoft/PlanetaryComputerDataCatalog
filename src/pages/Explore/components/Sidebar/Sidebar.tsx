import { useEffect, useMemo } from "react";
import { IStackStyles, IStackTokens, Stack, StackItem } from "@fluentui/react";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { resetMosaic, selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";
import { resetDetail } from "pages/Explore/state/detailSlice";
import MinimizeButton from "../controls/ToggleSidebarButton";
import ItemDetailPanel from "../ItemDetailPanel";
import SearchResultsPane from "./panes/SearchResultsPane";
import { useStacFilter } from "../../utils/hooks";
import { SIDEBAR_WIDTH } from "../../utils/constants";
import SelectorPane from "./panes/SelectorPane";
import TitleHeader from "./TitleHeader";
import InitialStateLoader from "./selectors/InitialStateLoader";

export const Sidebar = () => {
  const dispatch = useExploreDispatch();
  const showSidebar = useExploreSelector(s => s.map.showSidebar);
  const { isCustomQuery } = useExploreSelector(selectCurrentMosaic);
  const selectedItem = useExploreSelector(s => s.detail.selectedItem);
  const isDetailView = Boolean(selectedItem);

  const { width, sidebarVisibility } = useMemo(() => {
    return {
      width: showSidebar ? SIDEBAR_WIDTH : 0,
      sidebarVisibility: showSidebar ? "visible" : "hidden",
    };
  }, [showSidebar]);

  const { searchPanelDisplay, detailViewDisplay } = useMemo(() => {
    return {
      searchPanelDisplay: isDetailView ? "none" : "flex",
      detailViewDisplay: isDetailView ? "flex" : "none",
    };
  }, [isDetailView]);

  useEffect(() => {
    return () => {
      // When Explore unmounts, reset the mosaic state so it's fresh when the
      // user navigates back
      dispatch(resetMosaic());
      dispatch(resetDetail());
    };
  }, [dispatch]);

  const stacFilter = useStacFilter();

  const sidebarStyles: Partial<IStackStyles> = {
    root: {
      width: width,
      visibility: sidebarVisibility,
      transition: "width 0.3s",
      minWidth: 8,
    },
  };

  const searchPanelStyles: Partial<IStackStyles> = {
    root: {
      visibility: sidebarVisibility,
      display: searchPanelDisplay,
      transition: "visibility 0.1s",
      padding: 10,
      paddingBottom: 20,
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
      <StackItem styles={sidebarStyles}>
        <Stack styles={sidebarStackStyles}>
          <Stack styles={searchPanelStyles} tokens={stackTokens}>
            <TitleHeader />
            <InitialStateLoader />
            <SelectorPane isCustomQuery={isCustomQuery} />
          </Stack>
          <SearchResultsPane request={stacFilter} visible={!isDetailView} />
          <Stack styles={itemDetailPanelStyles} tokens={stackTokens}>
            <ItemDetailPanel />
          </Stack>
        </Stack>
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
const stackTokens: IStackTokens = {
  childrenGap: 5,
};
