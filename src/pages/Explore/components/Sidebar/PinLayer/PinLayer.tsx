import { IconButton } from "@fluentui/react";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import {
  pinCurrentMosaic,
  selectCurrentMosaic,
} from "pages/Explore/state/mosaicSlice";

export const PinLayer = () => {
  const dispatch = useExploreDispatch();
  const { isPinned } = useExploreSelector(selectCurrentMosaic);

  const handleClick = () => {
    dispatch(pinCurrentMosaic());
  };

  const title = isPinned
    ? "Stop editing and return to pinned layers"
    : "Pin this layer to the map and perform a new search";

  return (
    <IconButton
      title={title}
      aria-label={title}
      iconProps={{ iconName: isPinned ? "PencilReply" : "Pinned" }}
      onClick={handleClick}
    />
  );
};
