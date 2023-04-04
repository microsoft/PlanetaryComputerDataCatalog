import { Link } from "@fluentui/react";
import { SidebarPanels } from "pages/Explore/enums";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setSidebarPanel } from "pages/Explore/state/mapSlice";
import { ChatCommand } from "../ChatCommand";

export const ExploreCommand = () => {
  const dispatch = useExploreDispatch();

  const handleExplore = () => {
    dispatch(setSidebarPanel(SidebarPanels.itemSearch));
  };

  return (
    <ChatCommand>
      <Link
        title="Search and explore results from this dataset"
        onClick={handleExplore}
      >
        Explore
      </Link>
    </ChatCommand>
  );
};
