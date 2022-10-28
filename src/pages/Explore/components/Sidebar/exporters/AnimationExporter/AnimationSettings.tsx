import React from "react";
import {
  ContextualMenu,
  getTheme,
  IconButton,
  mergeStyleSets,
  Stack,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";

interface AnimationSettingsProps {
  showProgressBar: boolean;
  showBranding: boolean;
  onSettingsChange: (key: string, value: boolean) => void;
}

export const AnimationSettings: React.FC<AnimationSettingsProps> = ({
  showProgressBar,
  showBranding,
  onSettingsChange,
}) => {
  const [showMenu, { setFalse: hideMenu, toggle }] = useBoolean(false);

  const buttonId = useId("query-dropdown-button");
  return (
    <Stack>
      <IconButton
        id={buttonId}
        className={styles.button}
        iconProps={{ iconName: "Settings" }}
        title="Settings"
        onClick={toggle}
      />
      <ContextualMenu
        target={`#${buttonId}`}
        hidden={!showMenu}
        onDismiss={hideMenu}
        items={[
          {
            key: "progress-bar",
            text: "Include progress bar",
            canCheck: true,
            checked: showProgressBar,
            onClick: e => {
              e?.preventDefault();
              onSettingsChange("showProgressBar", !showProgressBar);
            },
          },
          {
            key: "branding",
            text: "Include branding",
            canCheck: true,
            checked: showBranding,
            onClick: e => {
              e?.preventDefault();
              onSettingsChange("showBranding", !showBranding);
            },
          },
        ]}
      />
    </Stack>
  );
};

const theme = getTheme();
const styles = mergeStyleSets({
  button: {
    color: theme.semanticColors.bodyText,
    "&:hover": {
      color: theme.semanticColors.bodyText,
    },
  },
});
