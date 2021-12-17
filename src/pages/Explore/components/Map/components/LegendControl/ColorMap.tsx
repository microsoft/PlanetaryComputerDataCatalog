import {
  FontSizes,
  IImageStyles,
  Image,
  ITextStyles,
  Stack,
  Text,
  getTheme,
} from "@fluentui/react";
import * as qs from "query-string";
import { DATA_URL } from "utils/constants";

const HEIGHT: number = 0.08;
const WIDTH: number = 3.5;

interface ColorMapProps {
  params: qs.ParsedQuery<string>;
}

const ColorMap = ({ params }: ColorMapProps) => {
  console.log(params);
  const img = makeColorRamp(params.colormap_name);
  const scale = makeScale(params.rescale);

  return (
    <Stack>
      {img}
      {scale}
    </Stack>
  );
};

export default ColorMap;

const makeColorRamp = (colormapName: string | string[] | null) => {
  if (!colormapName) return null;

  return (
    <Image
      styles={imageStyles}
      src={`${DATA_URL}/legend/colormap/${colormapName}?height=${HEIGHT}&width=${WIDTH}`}
    />
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
