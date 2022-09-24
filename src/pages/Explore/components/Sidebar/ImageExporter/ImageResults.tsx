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
import { ImageResponse, ImageResult } from "./ImageResult";

interface Props {
  collectionId: string;
  Images: ImageResponse[];
  isLoading: boolean;
}
export const ImageResults: React.FC<Props> = ({
  collectionId,
  Images,
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
      <Label>Images:</Label>
      <Stack
        horizontal
        wrap
        className="custom-overflow"
        styles={resultStyles}
        tokens={resultTokens}
      >
        {isLoading && imageShimmer}
        {Images.slice()
          .reverse()
          .map(Image => {
            return (
              <ImageResult
                key={Image.url}
                collectionId={collectionId}
                ImageResponse={Image}
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
