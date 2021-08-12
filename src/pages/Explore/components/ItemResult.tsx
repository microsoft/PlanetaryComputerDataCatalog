import { FontIcon, Stack } from "@fluentui/react";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import dayjs from "dayjs";
import { IStacItem } from "types/stac";
import ItemPreview from "./ItemPreview";

type ItemResultProps = {
  item: IStacItem;
};

const iconClass = mergeStyles({
  fontSize: 20,
  height: 20,
  width: 20,
});

const ItemResult = ({ item }: ItemResultProps) => {
  const cloud = item.properties?.["eo:cloud_cover"];
  const dt = item.properties?.datetime;

  return (
    <Stack
      horizontal
      tokens={{ childrenGap: 10 }}
      styles={{ root: { border: "1px solid #ccc", borderRadius: 4, padding: 0 } }}
    >
      <div style={{ maxWidth: 50 }}>
        <ItemPreview item={item} key={item.id} />
      </div>
      <Stack>
        <div>{item.id}</div>
        {dt && <div>{dayjs(dt).format("DD/MM/YYYY")}</div>}
        {cloud && (
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <span>{`${cloud.toFixed(1)}%`} </span>
            <FontIcon
              aria-label="Cloud Cover %"
              iconName="Cloud"
              className={iconClass}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default ItemResult;
