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
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { CollectionImageExport } from "pages/Explore/state/imageSlice";
import { ImageResult } from "./ImageResult";
import { ImageExportResponse } from "./types";

interface Props {
  collectionId: string;
  images: ImageExportResponse[];
  isLoading: boolean;
  onRemove: ActionCreatorWithPayload<CollectionImageExport, string>;
}

export const ImageResults: React.FC<Props> = ({
  collectionId,
  images,
  isLoading,
  onRemove,
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
        {images
          .slice()
          .reverse()
          .map(image => {
            return (
              <ImageResult
                key={image.url}
                collectionId={collectionId}
                imageResponse={image}
                onRemove={onRemove}
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
