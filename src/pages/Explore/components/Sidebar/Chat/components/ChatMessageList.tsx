import { Stack } from "@fluentui/react";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { ChatMessage } from "../types";
import { ChatBubble } from "./ChatBubble";
import { ExploreCommand } from "./commands/ExploreCommand";
import { MoreInfoCommand } from "./commands/MoreInfoCommand";
import { PinCommand } from "./commands/PinCommand";

import "../styles/bubble-transitions.css";

interface ChatMessageListProps {
  messages: ChatMessage[];
}
export const ChatMessageList = ({ messages }: ChatMessageListProps) => {
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

    const timeout = message.isUser ? 0 : 500;
    return (
      <CSSTransition key={`chat-${message.id}`} timeout={timeout} classNames="item">
        <Stack>
          <ChatBubble isUser={message.isUser}>{message.text}</ChatBubble>
          {isActiveLayerChat && commands}
        </Stack>
      </CSSTransition>
    );
  });

  return <TransitionGroup component={null}>{chats}</TransitionGroup>;
};

const tokens = { childrenGap: 10 };
