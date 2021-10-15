import { PrimaryButton, Stack, useTheme } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import SnippetCopyPanel from "./SnippetCopyPanel";

const ExploreInHub = () => {
  const theme = useTheme();
  const [isCalloutVisible, { toggle }] = useBoolean(false);
  const buttonId = useId("callout-button");

  return (
    <Stack
      styles={{
        root: {
          padding: 6,
          borderTop: "1px solid",
          borderColor: theme.palette.neutralLighter,
        },
      }}
    >
      <PrimaryButton id={buttonId} onClick={toggle} data-cy="explore-in-hub">
        Explore results in the Hub
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
