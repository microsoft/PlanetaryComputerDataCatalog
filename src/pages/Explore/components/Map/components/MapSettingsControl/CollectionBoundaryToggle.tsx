import { FontSizes, StackItem, Text, Toggle } from "@fluentui/react";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setShowCollectionOutline } from "pages/Explore/state/mapSlice";
import { MAX_ZOOM_FOR_COLLECTION_OUTLINE } from "pages/Explore/utils/constants";

const CollectionBoundaryToggle = () => {
  const dispatch = useExploreDispatch();
  const { showCollectionOutline, zoom } = useExploreSelector(s => s.map);
  const isCollectionOutlineDisabled = zoom > MAX_ZOOM_FOR_COLLECTION_OUTLINE;

  return (
    <StackItem>
      <Toggle
        label="Show current dataset extent on map"
        disabled={isCollectionOutlineDisabled}
        checked={showCollectionOutline}
        onChange={(_, checked) =>
          dispatch(setShowCollectionOutline(checked || false))
        }
      />
      {isCollectionOutlineDisabled && (
        <Text styles={{ root: { fontSize: FontSizes.small } }}>
          * Option not available at current zoom level
        </Text>
      )}
    </StackItem>
  );
};

export default CollectionBoundaryToggle;
