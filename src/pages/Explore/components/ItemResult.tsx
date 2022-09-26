import {
  getTheme,
  ILinkStyleProps,
  ILinkStyles,
  IStyle,
  IStyleFunctionOrObject,
  Link,
  Stack,
  Text,
} from "@fluentui/react";
import { CSSProperties, useCallback } from "react";
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
  const dispatch = useExploreDispatch();

  const showBounds = useCallback(() => {
    dispatch(setBoundaryShape(item.geometry));
  }, [dispatch, item.geometry]);

  const removeBounds = useCallback(() => {
    dispatch(clearBoundaryShape());
  }, [dispatch]);

  return (
    <Link
      onClick={() => dispatch(setSelectedItem(item))}
      styles={linkStyle}
      onMouseEnter={showBounds}
      onMouseLeave={removeBounds}
      data-cy="item-result"
    >
      <Stack
        horizontal
        tokens={{ childrenGap: 10 }}
        styles={{ root: { padding: 0 } }}
      >
        <div style={wrapperStyle}>
          <ItemPreview item={item} key={item.id} />
        </div>
        <Stack verticalAlign={"space-evenly"} style={{ paddingRight: "10px" }}>
          <Text styles={idStyles}>{item.id}</Text>
          <PriorityAttributes item={item} />
        </Stack>
      </Stack>
    </Link>
  );
};

export default ItemResult;

const theme = getTheme();

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

const linkStyle: IStyleFunctionOrObject<ILinkStyleProps, ILinkStyles> = {
  root: {
    borderWidth: 1,
    borderColor: theme.palette.neutralQuaternary,
    borderStyle: "solid",
    borderRadius: 2,
    overflow: "hidden",
    color: theme.palette.black,
    backgroundColor: theme.semanticColors.bodyBackground,
    marginBottom: 6,
    padding: 0,
    width: "99%",
    ":hover": hoverStyle,
    ":focus": activeStyle,
    ":active": activeStyle,
    ":active:hover": activeStyle,
  },
};

const wrapperStyle: CSSProperties = {
  minWidth: 100,
  minHeight: 100,
  borderRight: theme.palette.neutralLighter,
  borderRightWidth: 1,
  borderRightStyle: "solid",
  backgroundColor: theme.palette.black,
  borderRadius: "0",
};

const idStyles = {
  root: {
    fontWeight: "600",
    overflowWrap: "anywhere",
  },
};
