import { useMemo } from "react";
import {
  IStackStyles,
  Stack,
  getTheme,
  IStackTokens,
  Text,
  ITextStyles,
  Link,
  ILinkStyles,
} from "@fluentui/react";
import { FontSizes, FontWeights } from "@fluentui/style-utilities";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { selectCurrentCql, setIsCustomQuery } from "pages/Explore/state/mosaicSlice";
import { CqlParser } from "pages/Explore/utils/cql";
import { useCollectionQueryables } from "pages/Explore/utils/hooks/useCollectionQueryables";
import { DateField } from "../query/DateField";
import datetimeQueryable from "pages/Explore/utils/cql/datetimeDefaultQueryable";

const CustomQueryBuilder = () => {
  const dispatch = useExploreDispatch();
  const collection = useExploreSelector(s => s.mosaic.collection);
  const cql = useExploreSelector(selectCurrentCql);

  const handleClearCustom = () => {
    dispatch(setIsCustomQuery(false));
  };

  const { data: apiQueryable, isError } = useCollectionQueryables(collection?.id);

  const queryable = isError ? datetimeQueryable : apiQueryable;

  // Get parsed CQL object
  const parsed = useMemo(() => {
    if (!collection || !queryable) return null;
    return new CqlParser(cql, collection, queryable);
  }, [collection, queryable, cql]);

  if (!parsed) return null;

  const date = parsed.dateValue;
  const dateControl = date ? <DateField dateExpression={date} /> : null;

  // Get the rest of the controls needed to represent the CQL
  const expressions = parsed.getExpressions({ omit: ["datetime"] });
  const controls = expressions.map(e => e.control);

  return (
    <Stack styles={styles} tokens={controlStackTokens}>
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
      {dateControl}
      {controls}
    </Stack>
  );
};

export default CustomQueryBuilder;

const theme = getTheme();
const styles: IStackStyles = {
  root: {
    backgroundColor: theme.palette.neutralLighter,
    border: "1px solid",
    borderColor: theme.palette.neutralLight,
    borderRadius: 2,
    padding: "5px 5px 5px 10px",
  },
};
const controlStackTokens: IStackTokens = {
  childrenGap: 4,
};

const customStackStyles: IStackStyles = {
  root: { alignItems: "flexStart" },
};

const customStackTokens: IStackTokens = {
  childrenGap: 8,
};

const textStyle: Partial<ITextStyles> = {
  root: {
    fontWeight: FontWeights.semibold,
    fontSize: FontSizes.size14,
  },
};
const linkStyle: Partial<ILinkStyles> = {
  root: {
    fontSize: FontSizes.size12,
  },
};
