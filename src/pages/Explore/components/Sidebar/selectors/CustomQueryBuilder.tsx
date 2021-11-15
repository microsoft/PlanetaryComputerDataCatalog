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
  getTheme,
  VerticalDivider,
} from "@fluentui/react";
import { FontSizes, FontWeights } from "@fluentui/style-utilities";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { selectCurrentCql, setIsCustomQuery } from "pages/Explore/state/mosaicSlice";
import { CqlParser } from "pages/Explore/utils/cql";
import { useCollectionQueryables } from "pages/Explore/utils/hooks/useCollectionQueryables";
import { DateField } from "../../query/DateField";
import defaultQueryable from "pages/Explore/utils/cql/datetimeDefaultQueryable";
import { useCustomQueryUrlState } from "./hooks/useUrlState";
import { AddFilter } from "../../query/AddFilter/AddFilter";

const CustomQueryBuilder = () => {
  const dispatch = useExploreDispatch();
  const collection = useExploreSelector(s => s.mosaic.collection);
  const cql = useExploreSelector(selectCurrentCql);

  useCustomQueryUrlState();

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
  const parsedCql = useMemo(() => {
    if (!collection || !queryable) return null;
    return new CqlParser(cql, collection, queryable);
  }, [collection, queryable, cql]);

  const dateControl = parsedCql?.dateValue ? (
    <DateField dateExpression={parsedCql.dateValue} />
  ) : null;

  // Get the rest of the controls needed to represent the CQL
  const expressions = parsedCql?.getExpressions({ omit: ["datetime"] });
  const controls = expressions?.map(e => e.control);

  return (
    <Stack tokens={controlStackTokens}>
      <Separator styles={separatorStyles} />
      <Stack horizontal tokens={customStackTokens} styles={customStackStyles}>
        <Text styles={textStyle}>Custom filters</Text>
        <Stack horizontal tokens={customStackTokens}>
          <AddFilter queryable={queryable} cql={parsedCql} />
          <VerticalDivider />
          <Link
            onClick={handleClearCustom}
            styles={linkStyle}
            title="Clear the custom filters"
          >
            Clear
          </Link>
        </Stack>
      </Stack>
      {isLoading && loadingIndicator}
      {dateControl}
      {controls}
      <Separator styles={separatorStyles} />
    </Stack>
  );
};

export default CustomQueryBuilder;

const theme = getTheme();
const loadingIndicator = (
  <Shimmer
    shimmerElements={[{ type: ShimmerElementType.line, height: 34 }]}
    shimmerColors={{
      background: theme.palette.neutralLighter,
      shimmer: theme.palette.neutralLight,
      shimmerWave: theme.palette.neutralLighterAlt,
    }}
  />
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
