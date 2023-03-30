import { getTheme, ITextStyles, Text } from "@fluentui/react";
import { ReactNode } from "react";

interface ChatBubbleProps {
  isUser?: boolean;
  children: ReactNode;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ isUser = false, children }) => {
  const style = isUser ? userBubbleStyle : botBubbleStyle;
  return <Text styles={style}>{children}</Text>;
};

export default ChatBubble;

const theme = getTheme();
const userBubbleStyle: ITextStyles = {
  root: {
    backgroundColor: theme.palette.neutralLighter,
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
};

const botBubbleStyle: ITextStyles = {
  root: {
    backgroundColor: theme.palette.themeLighterAlt,
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
};
