import { useEffect, useRef } from "react";
import { ITextStyles, Separator, Stack, Text } from "@fluentui/react";
import { uniqueId } from "lodash-es";

import { addMessage, clearMessages } from "pages/Explore/state/chatSlice";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import {
  setCollection,
  setCustomQueryBody,
  setIsCustomQuery,
  setRenderOption,
} from "pages/Explore/state/mosaicSlice";
import { setCamera, setSidebarPanel } from "pages/Explore/state/mapSlice";
import { ExporterHeader } from "../exporters/BaseExporter/ExporterHeader";
import { SidebarPanels } from "pages/Explore/enums";
import { useUrlStateV2 } from "../selectors/hooks/useUrlStateV2";
import { useCollections } from "utils/requests";
import { useChatApi } from "./api";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { ExploreCommand } from "./commands/ExploreCommand";
import { PinCommand } from "./commands/PinCommand";
import { AuthPage } from "components/auth";
import { MoreInfoCommand } from "./commands/MoreInfoCommand";

const Chat = () => {
  const dispatch = useExploreDispatch();
  const { messages } = useExploreSelector(state => state.chat);

  const userMessages = messages.filter(m => m.isUser);
  const lastUserMessage = userMessages[userMessages.length - 1]?.text;
  const { isLoading, error, data } = useChatApi(lastUserMessage);

  const { data: collections } = useCollections();
  const messageListRef = useRef<HTMLDivElement>(null);

  if (error) {
    console.error(error);
  }

  useUrlStateV2();

  const handleSend = (message: string) => {
    dispatch(
      addMessage({
        id: uniqueId("user_"),
        timestamp: new Date().toISOString(),
        text: message,
        isUser: true,
        canRender: false,
        hasLayers: false,
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
    const messageListEl = messageListRef.current;
    if (messageListEl) {
      messageListEl.scrollIntoView(false);
    }

    const hasMessage = data && messages.map(m => m.id).includes(data.id);
    if (data && !hasMessage) {
      dispatch(
        addMessage({
          id: data.id,
          timestamp: new Date().toISOString(),
          text: data.response,
          isUser: false,
          canRender: data.layers.some(l => l.canRender),
          hasLayers: data.layers.length > 0,
          layers: data.layers,
          collectionIds: data.collectionIds,
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

      if (data.map) {
        dispatch(setCamera({ center: data.map.center, zoom: data.map.zoom }));
      }
    }
  }, [collections?.collections, data, dispatch, messages]);

  const chats = messages.map((message, index) => {
    const isActiveLayerChat =
      index > Math.max(messages.length - 3, 0) && !message.isUser;

    const commands = (
      <Stack horizontal verticalAlign="center" tokens={tokens}>
        {message.collectionIds?.map(cid => (
          <MoreInfoCommand collectionId={cid} />
        ))}
        {message.canRender && <ExploreCommand />}
        {message.canRender && <PinCommand />}
      </Stack>
    );

    return (
      <Stack tokens={{ childrenGap: 5 }} key={`chat-${message.id}`}>
        <ChatBubble key={index} isUser={message.isUser}>
          {message.text}
        </ChatBubble>
        {isActiveLayerChat && commands}
      </Stack>
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
      <AuthPage>
        <Stack.Item grow styles={{ root: styles.body }}>
          <div
            style={styles.bodyContentContainer as React.CSSProperties}
            ref={messageListRef}
          >
            {chats}
            {isLoading && loadingChat}
          </div>
        </Stack.Item>
        <Stack.Item styles={{ root: styles.footer }}>
          <Separator />
          <ChatInput onSend={handleSend} onReset={handleReset} />
        </Stack.Item>
      </AuthPage>
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

const tokens = { childrenGap: 10 };
