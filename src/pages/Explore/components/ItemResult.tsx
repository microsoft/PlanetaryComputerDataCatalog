import { IStyle, Stack, useTheme } from "@fluentui/react";
import dayjs from "dayjs";
import { IStacItem } from "types/stac";
import IconValue from "./IconValue";
import ItemPreview from "./ItemPreview";
import { useExploreDispatch } from "./state/hooks";
import { clearBoundaryShape, setBoundaryShape } from "./state/mapSlice";

type ItemResultProps = {
  item: IStacItem;
};

const ItemResult = ({ item }: ItemResultProps) => {
  const dispatch = useExploreDispatch();
  const theme = useTheme();

  const cloud = item.properties?.["eo:cloud_cover"];
  const dt = item.properties?.datetime;

  const hoverStyle: IStyle = {
    background: theme.palette.themeLighterAlt,
    cursor: "pointer",
    boxShadow: theme.effects.elevation8,
  };

  const rootSTyle: IStyle = {
    border: "1px solid #ccc",
    borderRadius: 4,
    padding: 0,
    ":hover": hoverStyle,
  };

  return (
    <Stack
      horizontal
      tokens={{ childrenGap: 10 }}
      styles={{
        root: rootSTyle,
      }}
      onMouseEnter={() => dispatch(setBoundaryShape(item.geometry))}
      onMouseLeave={() => dispatch(clearBoundaryShape())}
    >
      <div style={{ maxWidth: 100 }}>
        <ItemPreview item={item} key={item.id} />
      </div>
      <Stack>
        <div style={{ fontWeight: "bolder" }}>{item.id}</div>
        <Stack tokens={{ childrenGap: 5 }}>
          {dt && (
            <span title="Acquisition date">{dayjs(dt).format("MM/DD/YYYY")}</span>
          )}
          {cloud && (
            <IconValue
              iconName="Cloud"
              value={`${cloud.toFixed(1)}%`}
              title="Cloud Cover %"
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ItemResult;
