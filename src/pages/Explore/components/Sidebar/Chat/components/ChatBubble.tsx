import { getTheme, Stack } from "@fluentui/react";
import { ReactNode } from "react";

interface ChatBubbleProps {
  isUser?: boolean;
  children: ReactNode;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  isUser = false,
  children,
}) => {
  const styles = getStyles(isUser);

  return (
    <Stack
      horizontalAlign={isUser ? "end" : "start"}
      styles={{ root: styles.container }}
    >
      <div style={styles.bubble}>{children}</div>
    </Stack>
  );
};

const theme = getTheme();

const getStyles = (isUser: boolean) => {
  return {
    container: {
      marginLeft: isUser ? 20 : 0,
      marginRight: isUser ? 0 : 20,
      whiteSpace: "pre-wrap",
    },
    bubble: {
      fontSize: "1.1em",
      color: isUser ? "white" : "inherit",
      backgroundColor: isUser
        ? theme.palette.neutralSecondary
        : theme.palette.neutralLighter,
      border: "1px solid",
      borderColor: isUser
        ? theme.palette.neutralLighter
        : theme.palette.neutralLight,
      borderRadius: 5,
      padding: 8,
      alignSelf: isUser ? "flex-end" : "flex-start",
      margin: "5px 0",
    },
  };
};
