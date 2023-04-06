import {
  IconButton,
  IStackStyles,
  IStackTokens,
  Stack,
  StackItem,
  TextField,
} from "@fluentui/react";
import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onReset: () => void;
}

export const ChatInput = ({ onSend, onReset }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    value: string | undefined
  ) => {
    if (value && value.endsWith("\n")) {
      return;
    }
    setMessage(value || "");
  };

  return (
    <Stack horizontal styles={containerStyles} tokens={tokens}>
      <StackItem align="center">
        <IconButton
          title="Clear and start over"
          iconProps={{ iconName: "Broom" }}
          onClick={onReset}
        />
      </StackItem>
      <StackItem grow={1}>
        <TextField
          multiline
          autoAdjustHeight
          resizable={false}
          placeholder="Ask about Planetary Computer data..."
          value={message}
          onKeyDown={handleKeyPress}
          onChange={handleChange}
        />
      </StackItem>
    </Stack>
  );
};

const tokens: IStackTokens = { childrenGap: 10 };
const containerStyles: IStackStyles = {
  root: {},
};
