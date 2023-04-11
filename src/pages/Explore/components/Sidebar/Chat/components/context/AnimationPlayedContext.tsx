import { createContext, useContext, useState, ReactNode } from "react";

interface AnimationPlayedContextValue {
  addPlayedAnimation: (id: string) => void;
  isAnimationPlayed: (id: string) => boolean;
}

const AnimationPlayedContext = createContext<
  AnimationPlayedContextValue | undefined
>(undefined);

export const useAnimationPlayed = () => {
  const context = useContext(AnimationPlayedContext);
  if (!context) {
    throw new Error(
      "useAnimationPlayed must be used within an AnimationPlayedProvider"
    );
  }
  return context;
};

interface AnimationPlayedProviderProps {
  children: ReactNode;
}

export const AnimationPlayedProvider = ({
  children,
}: AnimationPlayedProviderProps) => {
  const [playedAnimations, setPlayedAnimations] = useState<Set<string>>(new Set());

  const addPlayedAnimation = (id: string) => {
    setPlayedAnimations(prevPlayedAnimations => {
      const newPlayedAnimations = new Set(prevPlayedAnimations);
      newPlayedAnimations.add(id);
      return newPlayedAnimations;
    });
  };

  const isAnimationPlayed = (id: string) => {
    return playedAnimations.has(id);
  };

  return (
    <AnimationPlayedContext.Provider
      value={{ addPlayedAnimation, isAnimationPlayed }}
    >
      {children}
    </AnimationPlayedContext.Provider>
  );
};
