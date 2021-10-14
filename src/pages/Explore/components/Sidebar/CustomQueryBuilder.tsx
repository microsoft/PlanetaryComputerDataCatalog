import { useMemo } from "react";
import { IStackStyles, Stack, getTheme, IStackTokens } from "@fluentui/react";

import { useExploreSelector } from "pages/Explore/state/hooks";
import { selectCurrentCql } from "pages/Explore/state/mosaicSlice";
import { CqlParser } from "pages/Explore/utils/cql";
import { useCollectionQueryables } from "pages/Explore/utils/hooks/useCollectionQueryables";
import { DateField } from "../query/DateField";

const CustomQueryBuilder = () => {
  const collection = useExploreSelector(s => s.mosaic.collection);
  const cql = useExploreSelector(selectCurrentCql);

  // TODO: handle errors, which include parsing schema. The user should
  // still be able to do a date query, as it's always available.
  const { data: queryable } = useCollectionQueryables(collection?.id);

  // Get parsed CQL object
  const parsed = useMemo(() => {
    if (!collection || !queryable) return null;
    return new CqlParser(cql, collection, queryable);
  }, [collection, queryable, cql]);

  if (!parsed) return null;

  const date = parsed.dateValue;
  const dateControl = date ? <DateField dateExpression={date} /> : null;

  const expressions = parsed.getExpressions({ omit: ["datetime"] });
  const controls = expressions.map(e => e.control);

  return (
    <Stack styles={styles} tokens={stackTokens}>
      {dateControl}
      {controls}
    </Stack>
  );
};

export default CustomQueryBuilder;

const theme = getTheme();
const styles: IStackStyles = {
  root: {
    backgroundColor: theme.palette.neutralLighterAlt,
    borderColor: theme.palette.neutralLight,
    padding: "5px 0px 10px 20px",
  },
};
const stackTokens: Partial<IStackTokens> = {
  childrenGap: 10,
};
