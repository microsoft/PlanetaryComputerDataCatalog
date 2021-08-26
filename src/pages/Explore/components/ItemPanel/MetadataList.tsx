import { IStacItem } from "types/stac";
import { stacFormatter } from "utils/stac";
import DetailListItem from "./DetailListItem";

interface MetadataListProps {
  item: IStacItem;
}

const MetadataList = ({ item }: MetadataListProps) => {
  return (
    <>
      {item.properties &&
        Object.entries(item.properties).map(([key, val]) => {
          return (
            <DetailListItem
              key={key}
              label={stacFormatter.label(key)}
              value={stacFormatter.format(val, key, item)}
            />
          );
        })}
    </>
  );
};

export default MetadataList;
