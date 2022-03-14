import { IconButton, IContextualMenuProps } from "@fluentui/react";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import {
  pinCurrentMosaic,
  setCurrentEditingLayerId,
} from "pages/Explore/state/mosaicSlice";
import { ILayerState } from "pages/Explore/types";
import { cmdButtonStyles } from "./LegendCmdBar";

type LayerOverflowOptionsProps = {
  layer: ILayerState;
};

const LayerOverflowOptions: React.FC<LayerOverflowOptionsProps> = ({ layer }) => {
  const dispatch = useExploreDispatch();
  const { currentEditingLayerId } = useExploreSelector(s => s.mosaic);
  const isEditing = layer.layerId === currentEditingLayerId;

  const handleEdit = () => {
    currentEditingLayerId && dispatch(pinCurrentMosaic());
    dispatch(setCurrentEditingLayerId(layer.layerId));
  };

  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: "re-edit",
        text: "Edit layer/filter options",
        iconProps: { iconName: "Edit" },
        disabled: !layer.isPinned || isEditing,
        onClick: handleEdit,
      },
    ],
  };
  return (
    <IconButton
      role="menuitem"
      aria-label="More actions"
      title="More actions"
      menuIconProps={{ iconName: "MoreVertical" }}
      menuProps={menuProps}
      styles={cmdButtonStyles}
    />
  );
};

export default LayerOverflowOptions;
