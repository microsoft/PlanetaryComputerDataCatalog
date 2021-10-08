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
  const dateC = date ? <DateField dateExpression={date} /> : null;
  return dateC;
};

export default CustomQueryBuilder;
