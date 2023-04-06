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
  border: `1px dashed ${theme.palette.neutralQuaternary}`,
  backgroundColor: theme.palette.neutralLighterAlt,
  padding: "1px 3px",
  borderRadius: 5,
  fontSize: 12,
};
