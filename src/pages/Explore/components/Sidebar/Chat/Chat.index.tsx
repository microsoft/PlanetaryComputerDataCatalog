import { useEffect } from "react";
import * as atlas from "azure-maps-control";
import { ITextStyles, Separator, Stack, Text } from "@fluentui/react";

import { addMessage, clearMessages } from "pages/Explore/state/chatSlice";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import {
  setCollection,
  setCustomQueryBody,
  setIsCustomQuery,
  setRenderOption,
} from "pages/Explore/state/mosaicSlice";
import { useCollections } from "utils/requests";
import { useChatApi } from "./api";
import ChatBubble from "./ChatBubble";
import { ChatInput } from "./Input";
import { TypingIndicator } from "./TypingIndicator";
import { setCamera, setSidebarPanel } from "pages/Explore/state/mapSlice";
import { ExporterHeader } from "../exporters/BaseExporter/ExporterHeader";
import { SidebarPanels } from "pages/Explore/enums";
import { uniqueId } from "lodash-es";
import { useUrlStateV2 } from "../selectors/hooks/useUrlStateV2";

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

  useUrlStateV2();

  const handleSend = (message: string) => {
    dispatch(
      addMessage({
        id: uniqueId(),
        timestamp: new Date().toISOString(),
        text: message,
        isUser: true,
      })
    );
  };

  const handleReset = () => {
    dispatch(clearMessages());
  };

  const handleClose = () => {
    dispatch(setSidebarPanel(SidebarPanels.itemSearch));
  };

  useEffect(() => {
    const hasMessage = data && messages.map(m => m.id).includes(data.id);
    if (data && !hasMessage) {
      dispatch(
        addMessage({
          id: data.id,
          timestamp: new Date().toISOString(),
          text: data.response,
          isUser: false,
        })
      );

      data.layers.forEach(layer => {
        const collection = collections?.collections.find(
          c => c.id === layer.collectionId
        );
        if (!layer.renderOption || !collection) {
          return;
        }

        dispatch(setCollection(collection));
        dispatch(setIsCustomQuery(true));
        dispatch(setCustomQueryBody(layer.mosaic));
        dispatch(setRenderOption(layer.renderOption));
      });

      if (data.boundary) {
        const bbox = atlas.data.BoundingBox.fromData(data.boundary.geometry);
        dispatch(setCamera({ bounds: bbox }));
      }
    }
  }, [collections?.collections, data, dispatch, messages]);

  const chats = messages.map((message, index) => {
    return (
      <ChatBubble key={index} isUser={message.isUser}>
        {message.text}
      </ChatBubble>
    );
  });

  const loadingChat = (
    <ChatBubble>
      <TypingIndicator />
    </ChatBubble>
  );

  return (
    <Stack styles={{ root: styles.container }}>
      <Stack.Item styles={{ root: styles.header }}>
        <ExporterHeader title="Planetary Computer Chat" onClose={handleClose}>
          <Text styles={introStyle}>
            An experimental generative AI search and explore experience for the
            Planetary Computer
          </Text>
        </ExporterHeader>
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
