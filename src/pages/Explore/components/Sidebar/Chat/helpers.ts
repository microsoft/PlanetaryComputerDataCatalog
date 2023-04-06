import { uniqueId } from "lodash-es";
import { ChatMessage, StateChatResponse } from "./types";

export const getMessageHistory = (
  messages: ChatMessage[],
  inputMessage: ChatMessage | undefined,
  responses: Record<string, any>
) => {
  return messages
    .filter(m => m.id !== inputMessage?.id)
    .map(message => {
      if (message.isUser) {
        return { input: message.text };
      }
      return responses[message.id];
    })
    .filter(Boolean);
};

export const makeUserMessage = (message: string) => {
  return {
    id: uniqueId("user_"),
    timestamp: new Date().toISOString(),
    text: message,
    isUser: true,
    canRender: false,
    hasLayers: false,
  };
};

export const makeErrorMessage = () => {
  return {
    id: uniqueId("error_"),
    timestamp: new Date().toISOString(),
    text: "Sorry, I seem to be having trouble with that request. Please try again.",
    isUser: false,
    canRender: false,
    hasLayers: false,
  };
};

export const makeBotMessage = (chat: StateChatResponse) => {
  return {
    id: chat.id,
    timestamp: new Date().toISOString(),
    text: chat.response,
    isUser: false,
    canRender: chat.layers.some(l => l.canRender),
    hasLayers: chat.layers.length > 0,
    layers: chat.layers,
    collectionIds: chat.collectionIds,
  };
};
