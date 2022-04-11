import {
  Shimmer,
  ShimmerElementType,
  Stack,
  StackItem,
  Text,
} from "@fluentui/react";
import { ILegendConfig } from "pages/Explore/types";
import * as qs from "query-string";
import { FC } from "react";
import { IntervalMap, useInterval } from "../helpers";
import {
  ColorSwatch,
  mappedItemLegendStackTokens,
  mappedItemLegendStyles,
  mappedItemTextStyles,
} from "./ClassMap";

interface IntervalProps {
  params: qs.ParsedQuery<string>;
  legendConfig: ILegendConfig | undefined;
}

const Interval: FC<IntervalProps> = ({ params, legendConfig }) => {
  const classmapName =
    params.colormap_name && Array.isArray(params.colormap_name)
      ? params.colormap_name[0]
      : params.colormap_name;

  const { isLoading, data: intervals } = useInterval(classmapName);

  const definition = classmapName
    ? intervals
    : JSON.parse(params.colormap as string);
  const loading = isLoading && (
    <Shimmer
      shimmerElements={[{ type: ShimmerElementType.line, height: 20, width: 233 }]}
    />
  );

  const labelScaleFactor = legendConfig?.scaleFactor ?? 0.0001;

  return (
    <StackItem styles={mappedItemLegendStyles} className="custom-overflow">
      {loading}
      <Stack tokens={mappedItemLegendStackTokens}>
        {definition && makeSwatches(definition, labelScaleFactor)}
      </Stack>
    </StackItem>
  );
};

export default Interval;

const makeSwatches = (intervals: IntervalMap, scaleFactor: number = 1) => {
  return intervals.map(([[min, max], rgba]) => {
    const formattedMin = (min * scaleFactor).toLocaleString();
    const formattedMax = (max * scaleFactor).toLocaleString();

    return (
      <StackItem key={`interval-${min}-${max}`}>
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 5 }}>
          <ColorSwatch color={rgba} />
          <Text
            styles={mappedItemTextStyles}
          >{`${formattedMin} – ${formattedMax}`}</Text>
        </Stack>
      </StackItem>
    );
  });
};
