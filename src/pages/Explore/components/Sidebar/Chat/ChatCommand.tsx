import { getTheme } from "@fluentui/react";
import { CSSProperties, ReactNode } from "react";

interface ChatCommandProps {
  children: ReactNode;
}

export const ChatCommand = ({ children }: ChatCommandProps) => {
  return <div style={commandStyles}>{children}</div>;
};

const theme = getTheme();

const commandStyles: CSSProperties = {
  border: `1px solid ${theme.palette.themePrimary}`,
  backgroundColor: theme.palette.neutralLighter,
  padding: "1px 3px",
  borderRadius: 5,
  fontSize: 12,
};
