import { PrimaryButton, Stack, getTheme } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import SnippetCopyPanel from "./SnippetCopyPanel";

const ExploreInHub = () => {
  const [isCalloutVisible, { toggle }] = useBoolean(false);
  const buttonId = useId("callout-button");

  return (
    <Stack className="explorer-explore-in-hub" styles={sidebarBottomButtonStyles}>
      <PrimaryButton id={buttonId} onClick={toggle} data-cy="explore-in-hub">
        Code snippet for search results
      </PrimaryButton>

      <SnippetCopyPanel
        buttonId={buttonId}
        visible={isCalloutVisible}
        onDismiss={toggle}
      />
    </Stack>
  );
};

export default ExploreInHub;

const theme = getTheme();
export const sidebarBottomButtonStyles = {
  root: {
    marginTop: 0,
    padding: 8,
    borderTop: "1px solid",
    borderColor: theme.palette.neutralLighter,
    backgroundColor: theme.semanticColors.bodyBackground,
  },
};
