import { IStackStyles, Stack, getTheme } from "@fluentui/react";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { selectCurrentCql } from "pages/Explore/state/mosaicSlice";
import { CqlParser } from "pages/Explore/utils/cql";
import DateField from "../query/DateField";

const CustomQueryBuilder = () => {
  const collection = useExploreSelector(s => s.mosaic.collection);
  const cql = useExploreSelector(selectCurrentCql);

  if (!collection) return null;

  // Get date
  const parsed = new CqlParser(cql, collection);
  const date = parsed.dateValue;
  const dateControl = date ? <DateField dateExpression={date} /> : null;

  return <Stack styles={styles}>{dateControl}</Stack>;
};

export default CustomQueryBuilder;

const theme = getTheme();
const styles: IStackStyles = {
  root: {
    backgroundColor: theme.palette.neutralLighterAlt,
    borderColor: theme.palette.neutralLight,
    // border: "1px solid",
    padding: "5px 0px 10px 20px",
  },
};
