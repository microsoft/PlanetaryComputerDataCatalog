import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage } from "../components/Sidebar/Chat/types";

export interface ChatState {
  messages: ChatMessage[];
  responses: Record<string, any>;
}

const initialState: ChatState = {
  messages: [
    {
      id: "initial",
      timestamp: new Date().toISOString(),
      text: "Hi! I can help you find and visualize geospatial data within the Planetary Computer. What are you looking for?",
      isUser: false,
      canRender: false,
      hasLayers: false,
    },
  ],
  responses: {},
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearChats: state => {
      return initialState;
    },
    addResponse: (state, action: PayloadAction<{ id: string; response: any }>) => {
      const { id, response } = action.payload;
      state.responses[id] = response;
    },
  },
});

export const { addMessage, clearChats, addResponse } = chatSlice.actions;

export default chatSlice.reducer;
