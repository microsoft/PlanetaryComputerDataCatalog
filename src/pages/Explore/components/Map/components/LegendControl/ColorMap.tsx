import { useCallback } from "react";
import { useBoolean } from "react-use";
import {
  FontSizes,
  IImageStyles,
  Image,
  ITextStyles,
  Stack,
  Text,
  getTheme,
  ImageLoadState,
  Shimmer,
  ShimmerElementType,
} from "@fluentui/react";
import * as qs from "query-string";

import { rootColormapUrl } from "./helpers";

const HEIGHT: number = 0.08;
const WIDTH: number = 3;

interface ColorMapProps {
  params: qs.ParsedQuery<string>;
}

const ColorMap = ({ params }: ColorMapProps) => {
  const img = useColorRamp(params.colormap_name);
  const scale = makeScale(params.rescale);

  return (
    <Stack>
      {img}
      {scale}
    </Stack>
  );
};

export default ColorMap;

const useColorRamp = (colormapName: string | string[] | null) => {
  const [loading, setLoading] = useBoolean(true);

  const handleStateChange = useCallback(
    (state: ImageLoadState) => {
      setLoading(state === ImageLoadState.notLoaded);
    },
    [setLoading]
  );
  if (!colormapName) return null;

  return (
    <>
      {loading && (
        <Shimmer
          shimmerElements={[
            { type: ShimmerElementType.line, height: 8, width: 233 },
          ]}
        />
      )}
      <Image
        styles={imageStyles}
        src={`${rootColormapUrl}/${colormapName}?height=${HEIGHT}&width=${WIDTH}`}
        onLoadingStateChange={handleStateChange}
      />
    </>
  );
};

const makeScale = (rescale: string | string[] | null) => {
  const scale = Array.isArray(rescale) ? rescale[0] : rescale;
  if (!scale) return null;

  const [low, high] = scale.split(",").map(s => parseFloat(s));
  const mid = (low + high) / 2;
  return (
    <Stack horizontal horizontalAlign="space-between">
      <Text styles={scaleStyles}>{low}</Text>
      <Text styles={scaleStyles}>{mid}</Text>
      <Text styles={scaleStyles}>{high}</Text>
    </Stack>
  );
};

const theme = getTheme();
const scaleStyles: ITextStyles = {
  root: {
    fontSize: FontSizes.small,
  },
};

const imageStyles: Partial<IImageStyles> = {
  image: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: theme.palette.neutralQuaternary,
    borderStyle: "solid",
  },
};
