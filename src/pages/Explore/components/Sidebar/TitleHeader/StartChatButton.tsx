import { Link } from "@fluentui/react";
import { SidebarPanels } from "pages/Explore/enums";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setSidebarPanel } from "pages/Explore/state/mapSlice";
import { buttonStyles } from "./ResetSelectors";

const StartChatButton = () => {
  const dispatch = useExploreDispatch();

  const activateChat = () => {
    dispatch(setSidebarPanel(SidebarPanels.chat));
  };

  return (
    <Link onClick={activateChat} styles={buttonStyles}>
      Chat
    </Link>
  );
};

export default StartChatButton;
