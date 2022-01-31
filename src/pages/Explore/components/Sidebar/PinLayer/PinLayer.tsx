import { IconButton } from "@fluentui/react";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { pinCurrentMosaic } from "pages/Explore/state/mosaicSlice";

export const PinLayer = () => {
  const dispatch = useExploreDispatch();
  const handleClick = () => {
    dispatch(pinCurrentMosaic());
  };

  const title = "Pin this layer to the map and perform a new search";
  return (
    <IconButton
      title={title}
      aria-label={title}
      iconProps={{ iconName: "Pinned" }}
      onClick={handleClick}
    />
  );
};
