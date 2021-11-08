import { useCallback } from "react";
import { FontSizes, Link, Stack } from "@fluentui/react";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { resetMosaicState } from "pages/Explore/state/mosaicSlice";

const ResetSelectors = () => {
  const dispatch = useExploreDispatch();
  const { collection } = useExploreSelector(state => state.mosaic);
  const disabled = !collection;

  const handleClick = useCallback(() => {
    dispatch<any>(resetMosaicState());
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
    marginRight: "2px",
    fontSize: FontSizes.small,
  },
};
