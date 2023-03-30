import { ITextStyles, Separator, Stack, Text } from "@fluentui/react";
import { addMessage, clearMessages } from "pages/Explore/state/chatSlice";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { useEffect } from "react";
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
    <Stack styles={{ root: styles.container }}>
      <Stack.Item styles={{ root: styles.header }}>
        <h3>Planetary Computer Chat</h3>
        <Text styles={introStyle}>
          An experimental generative AI search and explore experience for the
          Planetary Computer
        </Text>
        <Separator />
      </Stack.Item>
      <Stack.Item grow styles={{ root: styles.body }}>
        <Stack
          styles={{ root: styles.bodyContentContainer }}
          tokens={{ childrenGap: 10 }}
        >
          {chats}
          {isLoading && loadingChat}
        </Stack>
      </Stack.Item>
      <Stack.Item styles={{ root: styles.footer }}>
        <Separator />
        <ChatInput onSend={handleSend} onReset={handleReset} />
      </Stack.Item>
    </Stack>
  );
};

export default Chat;

const introStyle: ITextStyles = {
  root: {
    fontStyle: "italic",
  },
};

const styles = {
  container: {
    height: "100%",
    padding: 10,
  },
  header: {},
  body: {
    flexGrow: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  bodyContentContainer: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  footer: {},
};
