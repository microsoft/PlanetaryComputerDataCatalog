import {
  getTheme,
  ILinkStyleProps,
  ILinkStyles,
  IStackStyles,
  IStyle,
  IStyleFunctionOrObject,
  Link,
  Stack,
  Text,
} from "@fluentui/react";
import { CSSProperties, useCallback } from "react";
import { IStacItem } from "types/stac";
import { setSelectedItem } from "../state/detailSlice";
import { useExploreDispatch } from "../state/hooks";
import { clearBoundaryShape, setBoundaryShape } from "../state/mapSlice";
import PriorityAttributes from "./controls/PriorityAttributes";
import ItemPreviewButton from "./ItemPreviewButton";

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

  const handleSelectItem = useCallback(() => {
    dispatch(setSelectedItem(item));
  }, [dispatch, item]);

  return (
    <Stack
      horizontal
      styles={containerStyles}
      onMouseEnter={showBounds}
      onMouseLeave={removeBounds}
    >
      <ItemPreviewButton item={item} />
      <Link onClick={handleSelectItem} styles={linkStyle} data-cy="item-result">
        <Stack verticalAlign={"space-evenly"} style={detailsContainerStyle}>
          <Text styles={idStyles}>{item.id}</Text>
          <div style={attributeStyle}>
            <PriorityAttributes item={item} />
          </div>
        </Stack>
      </Link>
    </Stack>
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
    paddingLeft: 10,
    ":focus": activeStyle,
    ":active": activeStyle,
    ":hover": hoverStyle,
    ":active:hover": activeStyle,
  },
};

const idStyles = {
  root: {
    fontWeight: "600",
    overflowWrap: "anywhere",
  },
};

const attributeStyle: CSSProperties = {
  fontSize: 13,
};

const containerStyles: IStackStyles = {
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
    ":active:hover": activeStyle,
    "&:hover .explore-item-preview-button": {
      opacity: 0.6,
    },
  },
};

const detailsContainerStyle = {
  height: "100%",
  paddingRight: 10,
};
