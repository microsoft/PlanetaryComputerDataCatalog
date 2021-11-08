import { useMemo } from "react";
import {
  IStackStyles,
  Stack,
  IStackTokens,
  Text,
  ITextStyles,
  Link,
  ILinkStyles,
  Shimmer,
  ShimmerElementType,
  Separator,
  ISeparatorStyles,
} from "@fluentui/react";
import { FontSizes, FontWeights } from "@fluentui/style-utilities";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { selectCurrentCql, setIsCustomQuery } from "pages/Explore/state/mosaicSlice";
import { CqlParser } from "pages/Explore/utils/cql";
import { useCollectionQueryables } from "pages/Explore/utils/hooks/useCollectionQueryables";
import { DateField } from "../../query/DateField";
import defaultQueryable from "pages/Explore/utils/cql/datetimeDefaultQueryable";

const CustomQueryBuilder = () => {
  const dispatch = useExploreDispatch();
  const collection = useExploreSelector(s => s.mosaic.collection);
  const cql = useExploreSelector(selectCurrentCql);

  const handleClearCustom = () => {
    dispatch(setIsCustomQuery(false));
  };

  const {
    data: apiQueryable,
    isError,
    isLoading,
  } = useCollectionQueryables(collection?.id);

  const queryable = isError ? defaultQueryable : apiQueryable;

  // Get parsed CQL object
  const parsed = useMemo(() => {
    if (!collection || !queryable) return null;
    return new CqlParser(cql, collection, queryable);
  }, [collection, queryable, cql]);

  const dateControl = parsed?.dateValue ? (
    <DateField dateExpression={parsed.dateValue} />
  ) : null;

  // Get the rest of the controls needed to represent the CQL
  const expressions = parsed?.getExpressions({ omit: ["datetime"] });
  const controls = expressions?.map(e => e.control);

  return (
    <Stack tokens={controlStackTokens}>
      <Separator styles={separatorStyles} />
      <Stack horizontal tokens={customStackTokens} styles={customStackStyles}>
        <Text styles={textStyle}>Custom filter</Text>
        <Link
          onClick={handleClearCustom}
          styles={linkStyle}
          title="Clear the custom filter"
        >
          Clear
        </Link>
      </Stack>
      {isLoading && loadingIndicator}
      {dateControl}
      {controls}
      <Separator styles={separatorStyles} />
    </Stack>
  );
};

export default CustomQueryBuilder;

const loadingIndicator = (
  <Shimmer shimmerElements={[{ type: ShimmerElementType.line, height: 34 }]} />
);

const controlStackTokens: IStackTokens = {
  childrenGap: 4,
};

const customStackStyles: IStackStyles = {
  root: { alignItems: "flexStart", justifyContent: "space-between" },
};

const customStackTokens: IStackTokens = {
  childrenGap: 4,
};

const textStyle: Partial<ITextStyles> = {
  root: {
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.size14,
  },
};
const linkStyle: Partial<ILinkStyles> = {
  root: {
    fontSize: FontSizes.size12,
  },
};

const separatorStyles: Partial<ISeparatorStyles> = {
  root: { padding: 0, margin: 0, height: 10 },
};
