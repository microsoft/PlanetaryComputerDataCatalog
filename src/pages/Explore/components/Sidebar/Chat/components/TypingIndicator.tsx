import { CSSTransition } from "react-transition-group";
import { ChatBubble } from "./ChatBubble";

import "../styles/typing-indicator.css";
import "../styles/bubble-transitions.css";

interface TypingIndicatorProps {
  visible: boolean;
}
export const TypingIndicator = ({ visible }: TypingIndicatorProps) => {
  if (!visible) {
    return null;
  }

  return (
    <CSSTransition component={null} in={visible} timeout={500} classNames="item">
      <ChatBubble>
        <span
          className="typing-indicator"
          role="status"
          aria-live="polite"
          aria-hidden={true}
        >
          <span className="typing-indicator-dot"></span>
          <span className="typing-indicator-dot"></span>
          <span className="typing-indicator-dot"></span>
        </span>
      </ChatBubble>
    </CSSTransition>
  );
};
