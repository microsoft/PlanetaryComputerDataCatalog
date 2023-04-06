import { ChatMessage } from "./types";

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
