import {
  IconButton,
  IContextualMenuItem,
  IContextualMenuProps,
} from "@fluentui/react";
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
  const { previewMode } = useExploreSelector(s => s.detail);
  const isEditing = layerId === currentEditingLayerId;

  const handlePin = useCallback(() => {
    currentEditingLayerId && dispatch(pinCurrentMosaic());
  }, [currentEditingLayerId, dispatch]);

  const handleEdit = useCallback(() => {
    // If there is a layer being edited, pin it so the current map isn't disrupted
    // when reloading this layer to the sidebar.
    handlePin();
    dispatch(setCurrentEditingLayerId(layerId));
  }, [dispatch, handlePin, layerId]);

  const handleMoveUp = useCallback(() => {
    dispatch(moveLayerUp(layerId));
  }, [dispatch, layerId]);

  const handleMoveDown = useCallback(() => {
    dispatch(moveLayerDown(layerId));
  }, [dispatch, layerId]);

  const canMoveUp = layerOrder[0] !== layerId;
  const canMoveDown = layerOrder[layerOrder.length - 1] !== layerId;

  const pinOrEditItem: IContextualMenuItem = useMemo(() => {
    if (isPinned && !isEditing) {
      return {
        key: "re-edit",
        text: "Edit layer and filter options",
        iconProps: { iconName: "Edit" },
        onClick: handleEdit,
        disabled: previewMode.enabled,
      };
    }

    return {
      key: "re-pin",
      text: "Stop editing",
      iconProps: { iconName: "PencilReply" },
      onClick: handlePin,
      disabled: previewMode.enabled,
    };
  }, [handleEdit, handlePin, isEditing, isPinned, previewMode.enabled]);

  const menuProps: IContextualMenuProps = useMemo(() => {
    return {
      items: [
        pinOrEditItem,
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
  }, [pinOrEditItem, canMoveUp, handleMoveUp, canMoveDown, handleMoveDown]);

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
