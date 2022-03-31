import {
  FontSizes,
  getTheme,
  IStackItemStyles,
  IStackTokens,
  ITextStyles,
  Shimmer,
  ShimmerElementType,
  Stack,
  StackItem,
  Text,
} from "@fluentui/react";
import * as qs from "query-string";
import { IStacCollection } from "types/stac";
import { getClassNameByValue, useClassmap } from "../helpers";

interface ClassMapProps {
  params: qs.ParsedQuery<string>;
  collection: IStacCollection | null;
}

const ClassMap = ({ params, collection }: ClassMapProps) => {
  const classmapName = Array.isArray(params.colormap_name)
    ? params.colormap_name[0]
    : params.colormap_name;

  const { isLoading, data: classes } = useClassmap(classmapName);
  const loading = isLoading && (
    <Shimmer
      shimmerElements={[{ type: ShimmerElementType.line, height: 20, width: 233 }]}
    />
  );

  const assetName = Array.isArray(params.assets) ? params.assets[0] : params.assets;
  if (!assetName) return null;

  const asset = collection?.item_assets[assetName];
  if (!asset) return null;

  const classValues = asset["file:values"];
  if (!classValues) return null;

  const legendItems = classes
    ? Object.keys(classes).map(key => {
        const color = classes[key];
        const label = getClassNameByValue(key, classValues);
        const elKey = `legend-class-${key}`;

        // There may have been a mismatch in class values and the classmap. Only return
        // a legend item if there was a defined class value.
        return (
          label && (
            <Stack
              key={elKey}
              horizontal
              verticalAlign="center"
              tokens={mappedItemStackTokens}
            >
              <StackItem shrink={0}>
                <ColorSwatch color={color} />
              </StackItem>
              <Text styles={mappedItemTextStyles}>{label}</Text>
            </Stack>
          )
        );
      })
    : null;

  return (
    <StackItem styles={mappedItemLegendStyles} className="custom-overflow">
      {loading}
      <Stack tokens={mappedItemLegendStackTokens}>{legendItems}</Stack>
    </StackItem>
  );
};

const theme = getTheme();
export const ColorSwatch = ({ color }: { color: number[] }) => {
  return (
    <div
      style={{
        backgroundColor: `rgba(${color.join(",")}) `,
        width: 10,
        height: 10,
        borderRadius: "50%",
        borderWidth: 0.5,
        borderStyle: "solid",
        borderColor: theme.palette.neutralQuaternary,
      }}
    />
  );
};

export default ClassMap;

export const mappedItemStackTokens: IStackTokens = {
  childrenGap: 5,
};

export const mappedItemLegendStackTokens: IStackTokens = {
  childrenGap: 3,
};

export const mappedItemTextStyles: Partial<ITextStyles> = {
  root: {
    fontSize: FontSizes.smallPlus,
  },
};

export const mappedItemLegendStyles: IStackItemStyles = {
  root: {
    maxHeight: 150,
    overflowY: "auto",
    overflowX: "hidden",
  },
};
