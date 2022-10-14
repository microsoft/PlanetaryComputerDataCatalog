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
import { setItemDetail } from "../state/detailSlice";
import { useExploreDispatch, useExploreSelector } from "../state/hooks";
import { clearBoundaryShape, setBoundaryShape } from "../state/mapSlice";
import PriorityAttributes from "./controls/PriorityAttributes";
import ItemPreviewButton from "./ItemPreviewButton";

type ItemResultProps = {
  item: IStacItem;
};

const ItemResult = ({ item }: ItemResultProps) => {
  const dispatch = useExploreDispatch();
  const { selectedItem, isQuickPreviewMode } = useExploreSelector(s => s.detail);

  const showBounds = useCallback(() => {
    dispatch(setBoundaryShape(item.geometry));
  }, [dispatch, item.geometry]);

  const removeBounds = useCallback(() => {
    dispatch(clearBoundaryShape());
  }, [dispatch]);

  const handleSelectItem = useCallback(() => {
    dispatch(setItemDetail(item));
  }, [dispatch, item]);

  const selected = selectedItem?.id === item.id && isQuickPreviewMode;
  const x = selected ? selectedContainerStyles : containerStyles;
  return (
    <Stack
      horizontal
      styles={x}
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
  transition: "background 0.25s linear",
  boxShadow: theme.effects.elevation8,
  color: theme.palette.black,
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
    ":hover": activeStyle,
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

const rootContainerStyle: IStyle = {
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
    opacity: 0.8,
  },
};

const containerStyles: IStackStyles = {
  root: {
    borderWidth: 1,
    borderColor: theme.palette.neutralQuaternary,
    ...rootContainerStyle,
  },
};

const selectedContainerStyles: IStackStyles = {
  root: {
    borderWidth: 2,
    borderColor: theme.palette.themePrimary,
    background: `${theme.palette.neutralLighter} !important`,
    ...rootContainerStyle,
  },
};

const detailsContainerStyle = {
  height: "100%",
  width: "100%",
  paddingRight: 10,
};
