import { useEffect } from "react";
import {
  IStackStyles,
  IStackTokens,
  Stack,
  StackItem,
  Text,
  FontSizes,
  FontWeights,
} from "@fluentui/react";
import { ErrorBoundary } from "react-error-boundary";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { resetMosiac } from "pages/Explore/state/mosaicSlice";
import { resetDetail } from "pages/Explore/state/detailSlice";
import {
  CollectionSelector,
  MosaicPresetSelector,
  RenderOptionsSelector,
} from "./selectors";
import ResetSelectors from "./ResetSelectors";
import MinimizeButton from "../controls/ToggleSidebarButton";
import ItemDetailPanel from "../ItemDetailPanel";
import SearchResultsPane from "./panes/SearchResultsPane";
import { useStacFilter } from "../../utils/hooks";
import { SIDEBAR_WIDTH } from "../../utils/constants";
import ErrorFallback from "components/ErrorFallback";
import CustomizeQuery from "./CustomizeQuery";
import CustomQueryBuilder from "./CustomQueryBuilder";

const stackTokens: IStackTokens = {
  childrenGap: 5,
};

const Sidebar = () => {
  const dispatch = useExploreDispatch();
  const showSidebar = useExploreSelector(s => s.map.showSidebar);
  const width = showSidebar ? SIDEBAR_WIDTH : 0;
  const sidebarVisibility = showSidebar ? "visibile" : "hidden";
  const margin = showSidebar ? 5 : 3;

  const selectedItem = useExploreSelector(s => s.detail.selectedItem);
  const searchPanelDisplay = selectedItem ? "none" : "flex";
  const detailViewDisplay = selectedItem ? "flex" : "none";

  useEffect(() => {
    return () => {
      // When Explore unmounts, reset the mosaic state so it's fresh when the
      // user navigates back
      dispatch(resetMosiac());
      dispatch(resetDetail());
    };
  }, [dispatch]);

  const stacFilter = useStacFilter();
  const sidebarStyles: Partial<IStackStyles> = {
    root: {
      width: width,
      margin: margin,
      visibility: sidebarVisibility,
      transition: "width 0.3s",
      paddingLeft: 4,
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
          <Text
            styles={{
              root: {
                padding: "5px 0",
                fontSize: FontSizes.mediumPlus,
                fontWeight: FontWeights.bold,
              },
            }}
            block
          >
            Explore Planetary Computer datasets
          </Text>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Stack tokens={{ childrenGap: 5 }}>
              <CollectionSelector />
              <MosaicPresetSelector />
              <CustomQueryBuilder />
              <RenderOptionsSelector />
              <Stack horizontal horizontalAlign="end">
                <CustomizeQuery /> |
                <ResetSelectors />
              </Stack>
            </Stack>
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <SearchResultsPane request={stacFilter} />
          </ErrorBoundary>
        </Stack>
        <Stack styles={itemDetailPanelStyles} tokens={stackTokens}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <ItemDetailPanel />
          </ErrorBoundary>
        </Stack>
      </StackItem>
      <MinimizeButton />
    </>
  );
};

export default Sidebar;
