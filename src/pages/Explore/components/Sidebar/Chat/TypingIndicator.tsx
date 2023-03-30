import "./typing-indicator.css";

export const TypingIndicator = () => {
  return (
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
  );
};
