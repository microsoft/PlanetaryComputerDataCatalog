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
  animations: AnimationResponse[];
  isLoading: boolean;
}
export const AnimationResults: React.FC<Props> = ({ animations, isLoading }) => {
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
      <Label>Your animations:</Label>
      <Stack
        horizontal
        wrap
        horizontalAlign="space-evenly"
        className="custom-overflow"
        styles={resultStyles}
        tokens={resultTokens}
      >
        {isLoading && imageShimmer}
        {animations
          .slice()
          .reverse()
          .map(animation => (
            <AnimationResult key={animation.url} animationResponse={animation} />
          ))}
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
