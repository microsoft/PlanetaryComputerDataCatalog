import { useCallback } from "react";
import { FontSizes, Link, Stack } from "@fluentui/react";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import {
  resetMosaicState,
  selectCurrentMosaic,
} from "pages/Explore/state/mosaicSlice";

const ResetSelectors = () => {
  const dispatch = useExploreDispatch();
  const mosaic = useExploreSelector(selectCurrentMosaic);
  const disabled = !mosaic.collection;

  const handleClick = useCallback(() => {
    dispatch(resetMosaicState(mosaic.layerId));
  }, [dispatch, mosaic.layerId]);

  return (
    <Stack horizontal horizontalAlign={"end"}>
      <Link
        disabled={disabled}
        styles={buttonStyles}
        onClick={handleClick}
        title="Clear all selectors for current layer"
        data-cy="reset"
      >
        Clear
      </Link>
    </Stack>
  );
};

export default ResetSelectors;

export const buttonStyles = {
  root: {
    fontSize: FontSizes.small,
  },
};
