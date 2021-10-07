import { useExploreSelector } from "pages/Explore/state/hooks";
import { CqlParser } from "pages/Explore/utils/cql";
import DateField from "../query/DateField";

const CustomQueryBuilder = () => {
  const {
    query: { cql },
    collection,
  } = useExploreSelector(s => s.mosaic);

  if (!cql || !collection) return null;

  // Get date
  const parsed = new CqlParser(cql, collection);
  const date = parsed.dateValue;
  const dateC = date ? <DateField dateExpression={date} /> : null;
  return dateC;
};

export default CustomQueryBuilder;
