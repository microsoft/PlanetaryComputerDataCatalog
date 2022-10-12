import { getTheme, Icon, IIconStyles, Link } from "@fluentui/react";
import React, { CSSProperties } from "react";
import { IStacItem } from "types/stac";
import ItemPreview from "./ItemPreview";

interface ItemPreviewButtonProps {
  item: IStacItem;
}

export const ITEM_PREVIEW_BUTTON_CLASSNAME = "explore-item-preview-button";

const ItemPreviewButton: React.FC<ItemPreviewButtonProps> = ({ item }) => {
  const handlePreviewClick = () => {
    console.log("preview clicked", item.id);
  };
  return (
    <div style={wrapperStyle}>
      <div style={{ position: "absolute" }}>
        <ItemPreview item={item} key={item.id} />
      </div>
      <Link onClick={handlePreviewClick}>
        <Icon
          className={ITEM_PREVIEW_BUTTON_CLASSNAME}
          iconName="RedEye"
          styles={iconStyles}
        />
      </Link>
    </div>
  );
};
export default ItemPreviewButton;

const theme = getTheme();
const wrapperStyle: CSSProperties = {
  position: "relative",
  minWidth: 100,
  minHeight: 100,
  borderRight: theme.palette.neutralLighter,
  borderRightWidth: 1,
  borderRightStyle: "solid",
  backgroundColor: theme.palette.black,
  borderRadius: "0",
};

const iconStyles: IIconStyles = {
  root: {
    position: "absolute",
    left: "45%",
    top: "45%",
    color: "white",
    opacity: 0,
    transition: "opacity 0.25s linear",
    "&:hover": {
      opacity: 1,
    },
  },
};
