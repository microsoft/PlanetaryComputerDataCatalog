import { getTheme, Icon, IIconStyles, ILinkStyles, Link } from "@fluentui/react";
import React, { CSSProperties } from "react";
import { IStacItem } from "types/stac";
import { resetDetail } from "../state/detailSlice";
import { useExploreDispatch, useExploreSelector } from "../state/hooks";
import ItemPreview from "./ItemPreview";

interface ItemPreviewButtonProps {
  item: IStacItem;
  onItemPreview: () => void;
}

export const ITEM_PREVIEW_BUTTON_CLASSNAME = "explore-item-preview-button";

const ItemPreviewButton: React.FC<ItemPreviewButtonProps> = ({
  item,
  onItemPreview,
}) => {
  const dispatch = useExploreDispatch();
  const { selectedItem } = useExploreSelector(s => s.detail);
  const isSelected = selectedItem?.id === item.id;

  const handlePreviewClick = () => {
    if (isSelected) {
      dispatch(resetDetail());
    } else {
      onItemPreview();
    }
  };

  const icon = isSelected ? "Cancel" : "Nav2DMapView";
  const tooltip = isSelected
    ? "Close preview mode and return to search"
    : "Lock search and preview this item on the map";

  return (
    <div style={wrapperStyle}>
      <div style={{ position: "absolute" }}>
        <ItemPreview item={item} key={item.id} />
      </div>
      <Link
        title={tooltip}
        className={
          ITEM_PREVIEW_BUTTON_CLASSNAME + " " + (isSelected ? "selected" : "")
        }
        onClick={handlePreviewClick}
        styles={buttonStyles}
      >
        <Icon iconName={icon} styles={iconStyles} />
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
    color: "white",
    marginTop: 4,
    marginLeft: 7,
  },
};

const buttonStyles: ILinkStyles = {
  root: {
    opacity: 0,
    transition: "opacity 0.25s linear",
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 1,
    borderStyle: "solid",
    backgroundColor: "rgba(0,0,0,0.4)",
    position: "absolute",
    left: "calc(50% - 15px)",
    top: "calc(50% - 15px)",
    borderRadius: "50%",
    height: 30,
    width: 30,
    "&:hover": {
      opacity: "1 !important",
    },
    "&.selected": {
      opacity: "0.8 ",
    },
  },
};
