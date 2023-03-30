import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage } from "../components/Sidebar/Chat/types";

export interface ChatState {
  messages: ChatMessage[];
}

const initialState: ChatState = {
  messages: [
    {
      timestamp: new Date().toISOString(),
      text: "Hi! I can help you find and visualize geospatial data within the Planetary Computer. What are you looking for?",
      isUser: false,
    },
  ],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearMessages: state => {
      return initialState;
    },
  },
});

export const { addMessage, clearMessages } = chatSlice.actions;

export default chatSlice.reducer;
