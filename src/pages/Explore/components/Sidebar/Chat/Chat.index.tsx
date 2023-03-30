import { ITextStyles, Stack, Text } from "@fluentui/react";
import { addMessage, clearMessages } from "pages/Explore/state/chatSlice";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { useEffect } from "react";
import { sidebarPanelStyles } from "../exporters/AnimationExporter/AnimationExporter.index";
import { useChatApi } from "./api";
import ChatBubble from "./ChatBubble";
import { ChatInput } from "./Input";
import { TypingIndicator } from "./TypingIndicator";

const Chat = () => {
  const dispatch = useExploreDispatch();
  const { messages } = useExploreSelector(state => state.chat);

  const userMessages = messages.filter(m => m.isUser);
  const lastMessage = userMessages[userMessages.length - 1]?.text;
  const { isLoading, error, data } = useChatApi(lastMessage);

  if (error) {
    console.error(error);
  }

  const handleSend = (message: string) => {
    dispatch(
      addMessage({
        timestamp: new Date().toISOString(),
        text: message,
        isUser: true,
      })
    );
  };

  const handleReset = () => {
    dispatch(clearMessages());
  };

  const chats = messages.map((message, index) => {
    return (
      <ChatBubble key={index} isUser={message.isUser}>
        {message.text}
      </ChatBubble>
    );
  });

  useEffect(() => {
    if (data) {
      dispatch(
        addMessage({
          timestamp: new Date().toISOString(),
          text: data,
          isUser: false,
        })
      );
    }
  }, [data, dispatch]);

  const loadingChat = (
    <ChatBubble>
      <TypingIndicator />
    </ChatBubble>
  );

  return (
    <Stack styles={sidebarPanelStyles}>
      <Stack>
        <h3>Planetary Computer Chat</h3>
        <Text styles={introStyle}>
          An experimental generative AI search and explore experience for the
          Planetary Computer
        </Text>
      </Stack>
      <Stack verticalAlign="end" styles={{ root: { height: "100%" } }}>
        {chats}
        {isLoading && loadingChat}
        <ChatInput onSend={handleSend} onReset={handleReset} />
      </Stack>
    </Stack>
  );
};

export default Chat;

const introStyle: ITextStyles = {
  root: {
    fontStyle: "italic",
  },
};
