import { Icon, Link, Stack } from "@fluentui/react";
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
      <Stack horizontal verticalAlign="center">
        Chat <Icon iconName="ChatBot" style={{ paddingLeft: 2 }} />
      </Stack>
    </Link>
  );
};

export default StartChatButton;
