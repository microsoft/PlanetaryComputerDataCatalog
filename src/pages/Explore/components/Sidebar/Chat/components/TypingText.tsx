import React, { useState, useEffect } from "react";
import { sanitize } from "dompurify";
import { marked } from "marked";

import { useAnimationPlayed } from "./context/AnimationPlayedContext";
import { ChatMessage } from "../types";

interface TypingTextProps {
  typingEnabled: boolean;
  message: ChatMessage;
  typingSpeed?: number;
  onType: () => void;
}

const TypingText = ({
  typingEnabled,
  message,
  typingSpeed = 100,
  onType,
}: TypingTextProps) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const { addPlayedAnimation, isAnimationPlayed } = useAnimationPlayed();
  const animationStartedRef = React.useRef(false);

  useEffect(() => {
    let index = 0;

    const words = message.text.split(" ");

    const typeNextWord = () => {
      animationStartedRef.current = true;
      if (index < words.length) {
        setDisplayedText(
          prevText => prevText + (index === 0 ? "" : " ") + words[index]
        );
        index++;
        onType();
        setTimeout(typeNextWord, typingSpeed);
      }
    };

    if (typingEnabled && !isAnimationPlayed(message.id)) {
      typeNextWord();
      addPlayedAnimation(message.id);
    } else if (!typingEnabled || !animationStartedRef.current) {
      setDisplayedText(message.text);
    }
  }, [
    addPlayedAnimation,
    isAnimationPlayed,
    message.id,
    message.text,
    onType,
    typingEnabled,
    typingSpeed,
  ]);

  const renderedMsg = sanitize(
    marked.parseInline(displayedText, { smartypants: true })
  );

  return <div dangerouslySetInnerHTML={{ __html: renderedMsg }} />;
};

export default TypingText;
