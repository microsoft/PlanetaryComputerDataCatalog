import { useEffect, useRef } from "react";
import { ITextStyles, Separator, Stack, Text } from "@fluentui/react";
import { uniqueId } from "lodash-es";

import { addMessage, addResponse, clearChats } from "pages/Explore/state/chatSlice";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import {
  setBulkLayers,
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
  const { messages, responses } = useExploreSelector(state => state.chat);

  const history = messages.map(m => {
    if (m.isUser) {
      return { input: m.text };
    }
    return responses[m.id];
  });
  const userMessages = messages.filter(m => m.isUser);
  const lastUserMessage = userMessages[userMessages.length - 1];
  const { isLoading, isError, data } = useChatApi(lastUserMessage, history);

  const { data: collections } = useCollections();
  const messageListRef = useRef<HTMLDivElement>(null);

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
    dispatch(clearChats());
    dispatch(setBulkLayers({ layers: {}, layerOrder: [] }));
  };

  const handleClose = () => {
    dispatch(setSidebarPanel(SidebarPanels.itemSearch));
  };

  useEffect(() => {
    if (isError) {
      console.error(isError);

      dispatch(
        addMessage({
          id: uniqueId("error_"),
          timestamp: new Date().toISOString(),
          text: "Sorry, I seem to be having trouble with that request. Please try again.",
          isUser: false,
          canRender: false,
          hasLayers: false,
        })
      );
    }
  }, [dispatch, isError]);

  useEffect(() => {
    const messageListEl = messageListRef.current;
    if (messageListEl) {
      messageListEl.scrollIntoView(false);
    }

    if (!data) return;

    const { enriched, raw } = data;
    const hasMessage = data && messages.map(m => m.id).includes(enriched.id);
    if (data && !hasMessage) {
      dispatch(addResponse(raw));
      dispatch(
        addMessage({
          id: enriched.id,
          timestamp: new Date().toISOString(),
          text: enriched.response,
          isUser: false,
          canRender: enriched.layers.some(l => l.canRender),
          hasLayers: enriched.layers.length > 0,
          layers: enriched.layers,
          collectionIds: enriched.collectionIds,
        })
      );

      enriched.layers.forEach(layer => {
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

      if (enriched.map) {
        dispatch(
          setCamera({ center: enriched.map.center, zoom: enriched.map.zoom })
        );
      }
    }
  }, [collections?.collections, data, dispatch, messages]);

  const chats = messages.map((message, index) => {
    const isActiveLayerChat =
      index > Math.max(messages.length - 3, 0) && !message.isUser;

    const commands = (
      <Stack horizontal verticalAlign="center" tokens={tokens}>
        {message.canRender && <ExploreCommand />}
        {message.canRender && <PinCommand />}
        {message.collectionIds?.map(cid => (
          <MoreInfoCommand key={`infocmd-${message.id}-${cid}`} collectionId={cid} />
        ))}
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
