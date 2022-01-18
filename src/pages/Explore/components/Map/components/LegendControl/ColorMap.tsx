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
import { ILegendConfig } from "pages/Explore/types";

const HEIGHT: number = 0.08;
const WIDTH: number = 3.6;

interface ColorMapProps {
  params: qs.ParsedQuery<string>;
  legendConfig: ILegendConfig | undefined;
}

const ColorMap = ({ params, legendConfig }: ColorMapProps) => {
  const img = useColorRamp(params.colormap_name, legendConfig);

  const scale = makeScale(params.rescale, legendConfig?.labels);

  return (
    <Stack>
      {img}
      {scale}
    </Stack>
  );
};

export default ColorMap;

const useColorRamp = (
  colormapName: string | string[] | null,
  legendConfig: ILegendConfig | undefined
) => {
  const [loading, setLoading] = useBoolean(true);

  const handleStateChange = useCallback(
    (state: ImageLoadState) => {
      setLoading(state === ImageLoadState.notLoaded);
    },
    [setLoading]
  );
  if (!colormapName) return null;

  const config = {
    height: HEIGHT,
    width: WIDTH,
    trim_start: legendConfig?.trimStart,
    trim_end: legendConfig?.trimEnd,
  };

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
        src={`${rootColormapUrl}/${colormapName}?${qs.stringify(config)}`}
        onLoadingStateChange={handleStateChange}
        alt={`Legend color ramp using ${colormapName}`}
      />
    </>
  );
};

const makeScale = (
  rescale: string | string[] | null,
  customScale: string[] | undefined
) => {
  const items = customScale
    ? makeCustomScale(customScale)
    : makeNumericScale(rescale);
  return (
    <Stack horizontal horizontalAlign="space-between">
      {items}
    </Stack>
  );
};

const makeCustomScale = (customScale: string[]) => {
  return customScale.map((label, i) => {
    const key = `legend-scale-${i}`;
    return (
      <Text key={key} styles={scaleStyles}>
        {label}
      </Text>
    );
  });
};
const makeNumericScale = (rescale: string | string[] | null) => {
  if (!rescale) return null;
  const scale = Array.isArray(rescale) ? rescale : rescale.split(",");
  if (!scale || scale.filter(Boolean).length !== 2) return null;

  // @ts-ignore - null scale items are filtered out
  const [low, high] = scale.map(s => parseFloat(s));
  const mid = (low + high) / 2;
  return (
    <>
      <Text styles={scaleStyles}>{low}</Text>
      <Text styles={scaleStyles}>{mid}</Text>
      <Text styles={scaleStyles}>{high}</Text>
    </>
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
