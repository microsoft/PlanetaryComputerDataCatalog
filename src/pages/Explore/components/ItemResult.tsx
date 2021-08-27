import { IStyle, Link, Stack, Text, useTheme } from "@fluentui/react";
import dayjs from "dayjs";
import { useCallback } from "react";
import { IStacItem } from "types/stac";
import IconValue from "./controls/IconValue";
import ItemPreview from "./ItemPreview";
import { setSelectedItem } from "../state/detailSlice";
import { useExploreDispatch } from "../state/hooks";
import { clearBoundaryShape, setBoundaryShape } from "../state/mapSlice";

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
    boxShadow: theme.effects.elevation8,
    color: theme.palette.black,
    cursor: "pointer",
    textDecoration: "none",
  };

  const activeStyle: IStyle = {
    textDecoration: "none",
    color: theme.palette.black,
  };

  const rootStyle: IStyle = {
    borderWidth: 1,
    borderColor: theme.palette.neutralQuaternary,
    borderStyle: "solid",
    borderRadius: 4,
    color: theme.palette.black,
    marginBottom: 6,
    padding: 0,
    width: "99%",
    ":hover": hoverStyle,
    ":focus": activeStyle,
    ":active": activeStyle,
  };

  const showBounds = useCallback(() => {
    dispatch(setBoundaryShape(item.geometry));
  }, [dispatch, item.geometry]);

  const removeBounds = useCallback(() => {
    dispatch(clearBoundaryShape());
  }, [dispatch]);

  return (
    <Link
      onClick={() => dispatch(setSelectedItem(item))}
      styles={{ root: rootStyle }}
      onMouseEnter={showBounds}
      onMouseLeave={removeBounds}
    >
      <Stack
        horizontal
        tokens={{ childrenGap: 10 }}
        styles={{ root: { padding: 0 } }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRight: theme.palette.neutralLighter,
            borderRightWidth: 1,
            borderRightStyle: "solid",
          }}
        >
          <ItemPreview item={item} key={item.id} />
        </div>
        <Stack>
          <Text
            styles={{ root: { fontWeight: "bolder", overflowWrap: "anywhere" } }}
          >
            {item.id}
          </Text>
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
    </Link>
  );
};

export default ItemResult;
