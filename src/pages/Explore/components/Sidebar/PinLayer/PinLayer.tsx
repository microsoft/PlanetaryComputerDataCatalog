import { IconButton } from "@fluentui/react";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { pinCurrentMosaic } from "pages/Explore/state/mosaicSlice";

export const PinLayer = () => {
  const dispatch = useExploreDispatch();
  const handleClick = () => {
    dispatch(pinCurrentMosaic());
  };

  return <IconButton iconProps={{ iconName: "Pin" }} onClick={handleClick} />;
};
