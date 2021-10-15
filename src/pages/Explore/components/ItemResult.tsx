import { IStyle, Link, Stack, Text, useTheme } from "@fluentui/react";
import { useCallback } from "react";
import { IStacItem } from "types/stac";
import ItemPreview from "./ItemPreview";
import { setSelectedItem } from "../state/detailSlice";
import { useExploreDispatch } from "../state/hooks";
import { clearBoundaryShape, setBoundaryShape } from "../state/mapSlice";
import PriorityAttributes from "./controls/PriorityAttributes";

type ItemResultProps = {
  item: IStacItem;
};

const ItemResult = ({ item }: ItemResultProps) => {
  const theme = useTheme();
  const dispatch = useExploreDispatch();

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
    ":active:hover": activeStyle,
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
      data-cy="item-result"
    >
      <Stack
        horizontal
        tokens={{ childrenGap: 10 }}
        styles={{ root: { padding: 0 } }}
      >
        <div
          style={{
            minWidth: 100,
            minHeight: 100,
            borderRight: theme.palette.neutralLighter,
            borderRightWidth: 1,
            borderRightStyle: "solid",
            backgroundColor: theme.palette.black,
            borderRadius: "5px 0 0 3px",
          }}
        >
          <ItemPreview item={item} key={item.id} />
        </div>
        <Stack verticalAlign={"space-evenly"}>
          <Text
            styles={{ root: { fontWeight: "bolder", overflowWrap: "anywhere" } }}
          >
            {item.id}
          </Text>
          <PriorityAttributes item={item} />
        </Stack>
      </Stack>
    </Link>
  );
};

export default ItemResult;
