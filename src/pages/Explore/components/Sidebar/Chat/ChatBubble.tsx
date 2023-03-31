import { getTheme, Stack } from "@fluentui/react";
import { ReactNode } from "react";

interface ChatBubbleProps {
  isUser?: boolean;
  children: ReactNode;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ isUser = false, children }) => {
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

export default ChatBubble;

const theme = getTheme();

const getStyles = (isUser: boolean) => {
  return {
    container: {
      marginLeft: isUser ? 20 : 0,
      marginRight: isUser ? 0 : 20,
      whiteSpace: "pre-wrap",
    },
    bubble: {
      backgroundColor: isUser
        ? theme.palette.themeLighterAlt
        : theme.palette.themePrimary,
      borderRadius: 5,
      padding: 8,
      color: isUser ? "black" : "white",
      alignSelf: isUser ? "flex-end" : "flex-start",
    },
  };
};
