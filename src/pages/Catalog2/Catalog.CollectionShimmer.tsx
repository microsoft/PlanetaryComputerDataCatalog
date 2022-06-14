import { IStackTokens, Shimmer, ShimmerElementType, Stack } from "@fluentui/react";

export const CatalogCollectionShimmer = ({ height = 150, width = 266 }) => {
  return (
    <Stack horizontal tokens={gap}>
      <Shimmer
        className="catalog-collection-item-shimmer"
        shimmerElements={[
          { type: ShimmerElementType.line, height: height, width: width },
        ]}
      />
      <Stack tokens={gap}>
        <Shimmer
          shimmerElements={[
            { type: ShimmerElementType.line, height: 15, width: 200 },
          ]}
        />
        <Shimmer
          shimmerElements={[
            { type: ShimmerElementType.line, height: 15, width: 500 },
          ]}
        />
        <Shimmer
          shimmerElements={[
            { type: ShimmerElementType.line, height: 15, width: 500 },
          ]}
        />
      </Stack>
    </Stack>
  );
};

const gap: IStackTokens = {
  childrenGap: 10,
};

export const getCollectionShimmers = (
  count: number,
  height: number = 150,
  width: number = 266
) => {
  const shimmers = Array.from(Array(count).keys()).map(key => {
    return (
      <CatalogCollectionShimmer
        key={`collection-shimmer-${key}`}
        height={height}
        width={width}
      />
    );
  });

  return (
    <Stack data-cy="collection-loading-shimmers" tokens={gap}>
      {shimmers}
    </Stack>
  );
};
