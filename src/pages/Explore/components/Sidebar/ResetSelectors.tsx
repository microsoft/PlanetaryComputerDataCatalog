import { useCallback } from "react";
import { FontSizes, Link, Stack } from "@fluentui/react";

import { useExploreDispatch, useExploreSelector } from "../../state/hooks";
import { resetMosiac } from "pages/Explore/state/mosaicSlice";

const ResetSelectors = () => {
  const dispatch = useExploreDispatch();
  const { collection } = useExploreSelector(state => state.mosaic);
  const disabled = !collection;

  const handleClick = useCallback(() => {
    dispatch(resetMosiac());
  }, [dispatch]);

  return (
    <Stack horizontal horizontalAlign={"end"}>
      <Link disabled={disabled} styles={buttonStyles} onClick={handleClick}>
        Reset
      </Link>
    </Stack>
  );
};

export default ResetSelectors;

const buttonStyles = {
  root: {
    marginRight: "2px",
    fontSize: FontSizes.small,
  },
};
