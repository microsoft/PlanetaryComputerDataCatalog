import { useCallback } from "react";
import { FontSizes, Link, Stack } from "@fluentui/react";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import {
  resetMosaicState,
  selectCurrentMosaic,
} from "pages/Explore/state/mosaicSlice";

const ResetSelectors = () => {
  const dispatch = useExploreDispatch();
  const { collection } = useExploreSelector(selectCurrentMosaic);
  const disabled = !collection;

  const handleClick = useCallback(() => {
    dispatch(resetMosaicState());
  }, [dispatch]);

  return (
    <Stack horizontal horizontalAlign={"end"}>
      <Link
        disabled={disabled}
        styles={buttonStyles}
        onClick={handleClick}
        title="Reset all selectors"
        data-cy="reset"
      >
        Reset
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
