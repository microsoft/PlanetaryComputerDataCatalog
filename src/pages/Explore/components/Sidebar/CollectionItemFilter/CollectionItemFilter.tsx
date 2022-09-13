import ItemDetailPanel from "../../ItemDetailPanel";
import SearchResultsPane from "../panes/SearchResults/SearchResultsPane";
import SelectorPane from "../panes/SelectorPane";
import TitleHeader from "../TitleHeader";
import InitialStateLoader from "../selectors/InitialStateLoader";
import { IStackStyles, IStackTokens, Stack } from "@fluentui/react";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { selectCurrentMosaic } from "pages/Explore/state/mosaicSlice";
import { useStacFilter } from "pages/Explore/utils/hooks";
import { useMemo } from "react";

interface CollectionItemFilterProps {
  sidebarVisibility: string;
}

export const CollectionItemFilter: React.FC<CollectionItemFilterProps> = ({
  sidebarVisibility,
}) => {
  const { isCustomQuery } = useExploreSelector(selectCurrentMosaic);
  const { selectedItem } = useExploreSelector(s => s.detail);
  const isDetailView = Boolean(selectedItem);
  const { searchPanelDisplay, detailViewDisplay } = useMemo(() => {
    return {
      searchPanelDisplay: isDetailView ? "none" : "flex",
      detailViewDisplay: isDetailView ? "flex" : "none",
    };
  }, [isDetailView]);
  const stacFilter = useStacFilter();
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
      <Stack
        id="explorer-sidebar-selectors"
        styles={searchPanelStyles}
        tokens={stackTokens}
      >
        <TitleHeader />
        <InitialStateLoader />
        <SelectorPane isCustomQuery={isCustomQuery} />
      </Stack>
      <SearchResultsPane request={stacFilter} visible={!isDetailView} />
      <Stack styles={itemDetailPanelStyles} tokens={stackTokens}>
        <ItemDetailPanel />
      </Stack>
    </>
  );
};

const stackTokens: IStackTokens = {
  childrenGap: 5,
};
