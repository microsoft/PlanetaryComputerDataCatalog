import {
  getTheme,
  IShimmerColors,
  IStackStyles,
  IStackTokens,
  Label,
  Separator,
  Shimmer,
  ShimmerElementType,
  Stack,
} from "@fluentui/react";
import { AnimationResponse, AnimationResult } from "./AnimationResult";

interface Props {
  collectionId: string;
  animations: AnimationResponse[];
  isLoading: boolean;
}
export const AnimationResults: React.FC<Props> = ({
  collectionId,
  animations,
  isLoading,
}) => {
  const imageShimmer = (
    <Shimmer
      styles={shimmerStyles}
      shimmerColors={shimmerColors}
      shimmerElements={shimmerElements}
    />
  );

  return (
    <>
      <Separator />
      <Label>Animations:</Label>
      <Stack
        horizontal
        wrap
        className="custom-overflow"
        styles={resultStyles}
        tokens={resultTokens}
      >
        {isLoading && imageShimmer}
        {animations
          .slice()
          .reverse()
          .map(animation => {
            return (
              <AnimationResult
                key={animation.url}
                collectionId={collectionId}
                animationResponse={animation}
              />
            );
          })}
      </Stack>
    </>
  );
};

const theme = getTheme();

const resultTokens: IStackTokens = {
  childrenGap: 10,
};

const resultStyles: IStackStyles = {
  root: {
    overflowY: "auto",
    overflowX: "hidden",
  },
};

const shimmerStyles = {
  root: {
    border: `1px solid ${theme.palette.neutralLighter}`,
    borderRadius: 4,
  },
};
const shimmerColors: IShimmerColors = {
  shimmer: theme.palette.neutralLighterAlt,
  shimmerWave: theme.palette.neutralQuaternary,
};

const shimmerElements = [
  {
    type: ShimmerElementType.line,
    height: 180,
    width: 180,
  },
];
