import { Link } from "@fluentui/react";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import {
  pinCurrentMosaic,
  selectCurrentMosaic,
} from "pages/Explore/state/mosaicSlice";
import { ChatCommand } from "../ChatCommand";

export const PinCommand = () => {
  const dispatch = useExploreDispatch();
  const { isPinned } = useExploreSelector(selectCurrentMosaic);

  const handlePin = () => {
    dispatch(pinCurrentMosaic(true));
  };

  if (isPinned) return null;
  return (
    <ChatCommand>
      <Link
        title="Pin this layer to the map so stays available when working with other layers"
        onClick={handlePin}
      >
        Pin to the map
      </Link>
    </ChatCommand>
  );
};
