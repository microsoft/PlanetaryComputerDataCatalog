import { useEffect } from "react";
import { ITextStyles, Separator, Stack, Text } from "@fluentui/react";
import { uniqueId } from "lodash-es";

import { addMessage, clearMessages } from "pages/Explore/state/chatSlice";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { addLayer } from "pages/Explore/state/mosaicSlice";
import { ILayerState } from "pages/Explore/types";
import { useCollections } from "utils/requests";
import { useChatApi } from "./api";
import ChatBubble from "./ChatBubble";
import { ChatInput } from "./Input";
import { TypingIndicator } from "./TypingIndicator";
import { DEFAULT_MIN_ZOOM } from "pages/Explore/utils/constants";

const Chat = () => {
  const dispatch = useExploreDispatch();
  const { messages } = useExploreSelector(state => state.chat);

  const userMessages = messages.filter(m => m.isUser);
  const lastMessage = userMessages[userMessages.length - 1]?.text;
  const { isLoading, error, data } = useChatApi(lastMessage);

  const { data: collections } = useCollections();

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
          text: data.text,
          isUser: false,
        })
      );

      data.layers.forEach(layer => {
        if (!layer.renderOption) {
          return;
        }

        const layerState: ILayerState = {
          layerId: uniqueId(layer.collectionId),
          isPinned: false,
          collection:
            collections?.collections.find(c => c.id === layer.collectionId) || null,
          isCustomQuery: true,
          query: layer.mosaic,
          layer: {
            maxExtent: [],
            minZoom: layer.renderOption.minZoom || DEFAULT_MIN_ZOOM,
            opacity: 100,
            visible: true,
          },
          renderOption: layer.renderOption,
        };
        dispatch(addLayer(layerState));
      });
    }
  }, [collections?.collections, data, dispatch]);

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
