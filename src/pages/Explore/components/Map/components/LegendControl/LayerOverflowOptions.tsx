import { IconButton, IContextualMenuProps } from "@fluentui/react";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import {
  moveLayerDown,
  moveLayerUp,
  pinCurrentMosaic,
  setCurrentEditingLayerId,
} from "pages/Explore/state/mosaicSlice";
import { ILayerState } from "pages/Explore/types";
import { useCallback, useMemo } from "react";
import { cmdButtonStyles } from "./LegendCmdBar";

type LayerOverflowOptionsProps = {
  layer: ILayerState;
};

const LayerOverflowOptions: React.FC<LayerOverflowOptionsProps> = ({
  layer: { layerId, isPinned },
}) => {
  const dispatch = useExploreDispatch();
  const { currentEditingLayerId, layerOrder } = useExploreSelector(s => s.mosaic);
  const isEditing = layerId === currentEditingLayerId;

  const handleEdit = useCallback(() => {
    // If there is a layer being edited, pin it so the current map isn't disrupted
    // when reloading this layer to the sidebar.
    currentEditingLayerId && dispatch(pinCurrentMosaic());
    dispatch(setCurrentEditingLayerId(layerId));
  }, [dispatch, currentEditingLayerId, layerId]);

  const handleMoveUp = useCallback(() => {
    dispatch(moveLayerUp(layerId));
  }, [dispatch, layerId]);

  const handleMoveDown = useCallback(() => {
    dispatch(moveLayerDown(layerId));
  }, [dispatch, layerId]);

  const canMoveUp = layerOrder[0] !== layerId;
  const canMoveDown = layerOrder[layerOrder.length - 1] !== layerId;

  const menuProps: IContextualMenuProps = useMemo(() => {
    return {
      items: [
        {
          key: "re-edit",
          text: "Edit layer/filter options",
          iconProps: { iconName: "Edit" },
          disabled: !isPinned || isEditing,
          onClick: handleEdit,
        },
        {
          key: "moveup",
          text: "Move layer up",
          iconProps: { iconName: "Up" },
          disabled: !canMoveUp,
          onClick: handleMoveUp,
        },
        {
          key: "movedown",
          text: "Move layer down",
          iconProps: { iconName: "Down" },
          disabled: !canMoveDown,
          onClick: handleMoveDown,
        },
      ],
      styles: {
        subComponentStyles: {
          menuItem: {
            linkContent: { fontSize: 13 },
            icon: { fontSize: 13 },
          },
        },
      },
    };
  }, [
    isPinned,
    isEditing,
    handleEdit,
    canMoveUp,
    handleMoveUp,
    canMoveDown,
    handleMoveDown,
  ]);

  return (
    <IconButton
      role="menuitem"
      aria-label="More actions"
      title="More actions"
      menuIconProps={menuIconProps}
      menuProps={menuProps}
      styles={cmdButtonStyles}
    />
  );
};

export default LayerOverflowOptions;

const menuIconProps = { iconName: "MoreVertical" };
