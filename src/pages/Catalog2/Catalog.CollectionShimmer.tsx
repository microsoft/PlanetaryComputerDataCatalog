import { IStackTokens, Shimmer, ShimmerElementType, Stack } from "@fluentui/react";

export const CatalogCollectionShimmer = () => {
  return (
    <Stack horizontal tokens={gap}>
      <Shimmer
        shimmerElements={[
          { type: ShimmerElementType.line, height: 150, width: 266 },
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

export const getCollectionShimmers = (count: number) => {
  const shimmers = Array.from(Array(count).keys()).map(key => {
    return <CatalogCollectionShimmer key={`collection-shimmer-${key}`} />;
  });
  return (
    <Stack data-cy="collection-loading-shimmers" tokens={gap}>
      {shimmers}
    </Stack>
  );
};
