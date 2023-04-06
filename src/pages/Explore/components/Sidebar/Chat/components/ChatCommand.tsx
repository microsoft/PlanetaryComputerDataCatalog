import { ReactNode } from "react";
import { IStackStyles, Stack, getTheme } from "@fluentui/react";

interface ChatCommandProps {
  children: ReactNode;
}

export const ChatCommand = ({ children }: ChatCommandProps) => {
  return <Stack styles={commandStyles}>{children}</Stack>;
};

const theme = getTheme();

const commandStyles: IStackStyles = {
  root: {
    border: `1px dashed ${theme.palette.neutralQuaternary}`,
    backgroundColor: theme.palette.neutralLighterAlt,
    padding: "1px 3px",
    borderRadius: 5,
    fontSize: 12,
    "&:hover": {
      borderColor: theme.palette.neutralSecondaryAlt,
    },
  },
};
