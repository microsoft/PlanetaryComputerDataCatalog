import React, { useState, useEffect } from "react";
import { useAnimationPlayed } from "./context/AnimationPlayedContext";
import "../styles/typing-text.css";
import { ChatMessage } from "../types";

interface TypingTextProps {
  message: ChatMessage;
  typingSpeed?: number;
  onType: () => void;
}

const TypingText = ({ message, typingSpeed = 100, onType }: TypingTextProps) => {
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

    if (!isAnimationPlayed(message.id)) {
      typeNextWord();
      addPlayedAnimation(message.id);
    } else if (!animationStartedRef.current) {
      setDisplayedText(message.text);
    }
  }, [
    addPlayedAnimation,
    isAnimationPlayed,
    message.id,
    message.text,
    onType,
    typingSpeed,
  ]);

  return <div>{displayedText}</div>;
};

export default TypingText;
